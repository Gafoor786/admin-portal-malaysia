import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DeviceProps, flattenObject, uuidv4, IChooseSensors } from "./device";
import {
    Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Paper, FormControl,
    Checkbox, FormControlLabel, FormLabel, Radio, RadioGroup
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from "@components/custom-snack-bar";

const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
}));

export enum GraphType {
    None = '',
    Spline = 'spline',
    Bar = 'bar',
    BarColumn = 'column',
    Line = 'line'
}

type FormValues = {
    chooseSensors: IChooseSensors[];
};

export default function ChooseSensors(props: DeviceProps) {

    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });
    const maxAllowedSensors = 6;
    const valuesEvents: IChooseSensors[] = [];
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            chooseSensors: []
        },
        mode: "onBlur"
    });
    const { fields, append, remove, update } = useFieldArray({
        name: "chooseSensors",
        control
    });
    const onSubmit = (data: FormValues) => {
        // data.events.forEach(c => {
        //     const objC = valuesEvents.find(b => b.key === c.key)?.enumsObj;
        //     if (objC) {
        //         c.enumObj = objC;
        //     } else {
        //         c.enumObj = {};
        //     }
        // })
        if (fields.some(c => c.selected)) {
            props.chooseSensors = [...data.chooseSensors];

            props.next();
        }
    };

    const onCheckboxChange = (ev: ChangeEvent<HTMLInputElement>, index: number) => {
        try {
            const selectedValue = ev.target.checked;
            if (fields.filter(v => v.selected === true).length > (maxAllowedSensors - 1) && selectedValue) {
                update(index, { ...fields[index], selected: false })
                setAlertMessage({ msgType: AlertMsgTypes.Warning, msgs: [`Max ${maxAllowedSensors} sensors allowed`] })
            } else {
                if (selectedValue === false) {
                    update(index, { ...fields[index], priority: 3, selected: selectedValue })
                } else {
                    update(index, { ...fields[index], selected: selectedValue })
                }

            }

        } catch {
            // valuesEvents.push({
            //     key: key,
            //     enumsObj: {}
            // });
        }

    }

    const onChange = (ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        try {
            const selectedValue = Number(ev.target.value);
            fields[index].priority = selectedValue;


            update(index, { ...fields[index] })

            for (let i = 0; i < fields.length; i++) {
                if (i !== index) {
                    if (selectedValue === fields[i].priority) {
                        update(i, { ...fields[i], priority: 3 })
                    }
                }
            }

        } catch {
            // valuesEvents.push({
            //     key: key,
            //     enumsObj: {}
            // });
        }

    }



    useEffect(() => {
        let unmounted = false;
        if (props.rawConfig?.deviceData?.[0].data && !unmounted) {
            const obj = Object.keys(flattenObject(props.rawConfig?.deviceData?.[0].data));
            obj.forEach((c, i) => {
                let name = '';
                const f = props.sensorsForm.find(v => v.key === c);
                if (f) {
                    name = f.name;
                }
                fields.push({
                    key: c,
                    selected: false,
                    displayName: `${name} (${c})`,
                    priority: 3,
                    id: uuidv4()
                })
            });
        }

        return () => {
            unmounted = true;
        };
    }, [
        props.sensorsForm
    ]);

    useEffect(() => {

        if (fields.length === 0 && props.sensorsForm.length > 0) {
            console.log(props.sensorsForm, props.existingSensors)
            props.sensorsForm.forEach((c, i) => {
                const f = props.existingSensors.find(v => v.key === c.key);
                if (f) {
                    // name = f.name;
                }
                fields.push({
                    key: c.key,
                    selected: f?.dashboardSelected ?? false,
                    displayName: `${c.name} (${c.key})`,
                    priority: f?.priority ?? 3,
                    id: f?.sensorId ?? uuidv4()
                })
            });
        }

    }, [
        props.sensorsForm
    ]);
    // const [alertMessage, setAlertMessage] = React.useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });

    return (
        <div>
            {/* <CustomizedSnackbars params={alertMessage} /> */}
            {CustomizedSnackbars({ params: alertMessage })}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <Grid style={{ padding: 10 }}>
                    <ul>
                        <li>
                            For dashboard choose at least one sensor value and max {maxAllowedSensors} sensor values can be selected
                        </li>
                        <li>
                            Only one primary and one secondary will be selected and others will be selected as default
                        </li>

                    </ul>
                    {/* <h4 color="secondary"> Note: </h4>
                    <h4 color="secondary"> Note: </h4> */}
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Choose</TableCell>
                                    <TableCell>Alias Name</TableCell>

                                    {/* <TableCell align="center">Image 2</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields.map((item, index) => {
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell component="th" scope="row" style={{ width: 250 }}>

                                                {/* <Controller
                                                    // rules={{ required: true }}
                                                    control={control}
                                                    defaultValue={item.selected}
                                                    name={`chooseSensors.${index}.selected`}
                                                    render={({ field }) => {
                                                        // const { name, onBlur, value } = field;
                                                        return (

                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        {...field}
                                                                    />
                                                                }
                                                                label={item.displayName} />
                                                        );
                                                    }}
                                                /> */}
                                                <Controller
                                                    control={control}
                                                    defaultValue={item.selected}
                                                    name={`chooseSensors.${index}.selected`}
                                                    render={({ field }) => {
                                                        const { name, onBlur, value } = field;
                                                        return (
                                                            <FormControlLabel
                                                                value="end"
                                                                control={<Checkbox checked={value} onChange={(e) => onCheckboxChange(e, index)} />}
                                                                label={item.displayName}
                                                                labelPlacement="end"
                                                            />
                                                        );
                                                    }}
                                                />
                                                <input
                                                    placeholder="name"
                                                    hidden
                                                    {...register(`chooseSensors.${index}.key` as const, {
                                                        required: true,
                                                    })}
                                                    className={errors?.chooseSensors?.[index]?.key ? "error" : ""}
                                                    defaultValue={item.key}
                                                />

                                            </TableCell>
                                            <TableCell >

                                                <Controller
                                                    rules={{ required: true }}
                                                    control={control}
                                                    defaultValue={item.priority}

                                                    name={`chooseSensors.${index}.priority`}
                                                    render={({ field }) => {
                                                        // const { name, onBlur, value } = field;
                                                        return (
                                                            <FormControl component="fieldset" disabled={!item.selected}>
                                                                <FormLabel component="legend">Priority</FormLabel>
                                                                <RadioGroup row  {...field} onChange={(e) => onChange(e, index)} >
                                                                    <FormControlLabel value={1} control={<Radio />} label="Primary" />
                                                                    <FormControlLabel value={2} control={<Radio />} label="Secondary" />
                                                                    <FormControlLabel value={3} control={<Radio />} label="Default" />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        );
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                            </TableBody>
                        </Table>

                    </TableContainer>

                </Grid>






                {/* <input {...register("firstName")} placeholder="First Name" /> */}

                {/* <Total control={control} /> */}
                {/* 
                <button
                    type="button"
                    onClick={() =>
                        append({
                            name: "",
                            quantity: 0,
                            price: 0
                        })
                    }
                >
                    APPEND
                </button> */}

                <div style={{ marginBottom: 10 }}>
                    <StyledButtonBase
                        onClick={() => props.back()}
                    >
                        Back
                    </StyledButtonBase>
                    <StyledButtonBase
                        variant="contained"
                        color="primary"
                        type="submit"
                    // onClick={() => props.next()}

                    >
                        Next
                    </StyledButtonBase>
                </div>
            </form>


        </div>
    );
}
