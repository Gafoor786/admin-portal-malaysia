import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DeviceProps, flattenObject, EventFormProps, uuidv4, SensorEvents, IEnumData } from "./device";
import {
    Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Paper, TextField
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
    events: EventFormProps[];
};

export default function AddEvents(props: DeviceProps) {

    const valuesEvents: SensorEvents[] = [];
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            events: []
        },
        mode: "onBlur"
    });
    const { fields, append, remove, update } = useFieldArray({
        name: "events",
        control
    });
    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });

    const onSubmit = (data: FormValues) => {
        data.events.forEach(c => {
            const objC = valuesEvents.find(b => b.key === c.key)?.enumsObj;
            if (objC) {
                c.enumObj = objC;
            } else {
                c.enumObj = {};
            }
        })
        props.eventsForm = data.events;

        props.next();
    };

    const onBlur = (ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, item: EventFormProps, index: number) => {
        try {

            const sp = ev.target.value.split('\n');
            let obj: IEnumData = {};
            let valid = true;
            sp.forEach(c => {
                if (c) {
                    const spli = c.split(':');
                    if (spli.length === 2) {
                        const jsonKey = spli[0].trim();
                        obj = { ...obj, ...{ [jsonKey]: spli[1].trim() } };
                    } else {
                        valid = false;
                    }
                }
            });

            if (valid) {
                const { key } = item;
                if (valuesEvents.some(c => c.key === key)) {
                    const index = valuesEvents.findIndex(c => c.key === key);
                    valuesEvents[index].enumsObj = obj;
                } else {
                    valuesEvents.push({
                        key: key,
                        enumsObj: obj
                    });
                }
            } else {
                setAlertMessage({ msgType: AlertMsgTypes.Warning, msgs: [`Invalid config found`] })
                update(index, { ...fields[index], enumObj: undefined, enumsStr: '' })

            }
        } catch {
            setAlertMessage({ msgType: AlertMsgTypes.Warning, msgs: [`Invalid config found`] })
            update(index, { ...fields[index], enumObj: undefined, enumsStr: '' })

        }

    }



    useEffect(() => {
        let unmounted = false;

        if (props.rawConfig?.deviceData?.[0].event && !unmounted) {
            const obj = Object.keys(flattenObject(props.rawConfig?.deviceData?.[0].event));
            obj.forEach((c, i) => {
                fields.push({
                    key: c,
                    name: '',
                    enumsStr: '',
                    enumObj: {},
                    id: uuidv4()
                })
            });

        }

        return () => {
            unmounted = true;
        };
    }, [
        props.rawConfig
    ]);

    useEffect(() => {
        props.existingEvents.forEach((c, i) => {
            fields.push({
                key: c.key,
                name: c.name,
                enumObj: c.enumObj,
                enumsStr: c.enumsStr,
                id: c.eventId
            })
        });
    }, [
        props.existingEvents
    ]);

    return (
        <div>
            {CustomizedSnackbars({ params: alertMessage })}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <Grid style={{ padding: 10 }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mapping Key</TableCell>
                                    <TableCell>Alias Name</TableCell>
                                    <TableCell >Enums</TableCell>

                                    {/* <TableCell align="center">Image 2</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields.map((item, index) => {
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell component="th" scope="row">
                                                {item.key}
                                                <input

                                                    placeholder="name"
                                                    hidden
                                                    {...register(`events.${index}.key` as const, {
                                                        required: true,
                                                    })}
                                                    className={errors?.events?.[index]?.key ? "error" : ""}
                                                // defaultValue={field.name}
                                                />


                                            </TableCell>
                                            <TableCell >
                                                <Controller
                                                    render={
                                                        ({ field }) => <TextField
                                                            {...field}
                                                            // value={fields[index].min}
                                                            onBlur={() => update(index, { ...fields[index], name: field.value })}
                                                            required
                                                            label={"Name"} />
                                                    }
                                                    control={control}
                                                    name={`events.${index}.name`}
                                                    defaultValue={item.name}
                                                />

                                            </TableCell>
                                            <TableCell >

                                                <Controller
                                                    control={control}
                                                    defaultValue={item.enumsStr}
                                                    name={`events.${index}.enumsStr`}
                                                    render={({ field }) => {
                                                        const { name, onChange, value } = field;
                                                        return (
                                                            <TextField
                                                                fullWidth
                                                                {...field}
                                                                // {...register(`events.${index}.enumsStr` as const)}
                                                                onBlur={(e) => onBlur(e, item, index)}
                                                                multiline
                                                                value={value}
                                                                minRows={3}
                                                                placeholder={`0 : Xxx
1 : Xxxx Xxxxxxx
2 : X Xxxx Xxxxx
                                        `}

                                                                label={"Enum List"}

                                                            />

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
