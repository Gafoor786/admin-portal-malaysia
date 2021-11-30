import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DeviceProps, flattenObject, uuidv4, SensorFormProps } from "./device";
import {
    Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Paper, TextField, IconButton, Select, MenuItem
} from '@mui/material'
import { Publish, Delete } from '@mui/icons-material';
import { useEffect } from "react";
import { styled } from '@mui/material/styles';

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
    sensors: SensorFormProps[];
};


export default function AddSensors(props: DeviceProps) {

    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>({
        shouldUnregister: false,
        defaultValues: {
            sensors: []
        },
        mode: "onBlur"
    });
    const { fields, append, remove, update } = useFieldArray({
        name: "sensors",
        control
    });
    const onSubmit = (data: FormValues) => {
        props.sensorsForm = [];
        props.sensorsForm = [...data.sensors];
        console.log(props.sensorsForm)
        props.next();
    };

    // const sensors = watch("sensors");
    // const handleChange = (event: React.ChangeEvent<{ value: string | number }>, index: number) => {

    //     fields[index].graphType = event.target.value as GraphType;

    // };

    // const handleNameBlur = (event: React.ChangeEvent<{ value: string | number }>, index: number) => {

    //     // fields[index].name = event.target.value as string;
    // };

    const handleIcon = (event: React.ChangeEvent<{ files: FileList[] }>, index: number) => {

        // fields[index].name = event.target.value as string;


        let file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event: any) => {
            update(index, { ...fields[index], icon: event.target.result })
        });
        reader.readAsDataURL(file as unknown as Blob);
    };




    useEffect(() => {
        let unmounted = false;
        if (props.rawConfig?.deviceData?.[0].data && !unmounted) {
            const obj = Object.keys(flattenObject(props.rawConfig?.deviceData?.[0].data));
            obj.forEach((c, i) => {
                fields.push({
                    key: c,
                    name: '',
                    unit: '',
                    min: '',
                    max: '',
                    graphType: GraphType.Spline,
                    icon: '',
                    dashboardSelected: undefined,
                    priority: undefined,
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
        props.existingSensors.forEach((c, i) => {
            fields.push({
                key: c.key,
                name: c.name,
                unit: c.unit,
                min: c.min,
                max: c.max,
                graphType: c.graphType as GraphType,
                icon: c.icon,
                dashboardSelected: c.dashboardSelected,
                priority: c.priority,
                id: c.sensorId
            })
        });
    }, [
        props.existingSensors
    ]);


    return (
        <div>
            <div>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <Grid style={{ padding: 10 }}>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mapping Key</TableCell>
                                        <TableCell>Alias Name</TableCell>
                                        <TableCell style={{ maxWidth: 50 }}>Unit</TableCell>
                                        <TableCell >Min</TableCell>
                                        <TableCell >Max</TableCell>
                                        <TableCell >Graph Type</TableCell>
                                        <TableCell align="center">Image</TableCell>
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
                                                        {...register(`sensors.${index}.key` as const, {
                                                            required: true,
                                                        })}
                                                        className={errors?.sensors?.[index]?.key ? "error" : ""}
                                                        defaultValue={item.name}
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
                                                        name={`sensors.${index}.name`}
                                                        defaultValue={item.name}
                                                    />

                                                </TableCell>
                                                <TableCell >
                                                    <Controller
                                                        render={
                                                            ({ field }) => <TextField
                                                                {...field}
                                                                // value={fields[index].min}
                                                                onBlur={() => update(index, { ...fields[index], unit: field.value })}
                                                                label={"Unit"} />
                                                        }
                                                        control={control}
                                                        name={`sensors.${index}.unit`}
                                                        defaultValue={item.unit}
                                                    />


                                                </TableCell>

                                                <TableCell >
                                                    <Controller
                                                        render={
                                                            ({ field }) => <TextField
                                                                {...field}
                                                                // value={fields[index].min}
                                                                onBlur={() => update(index, { ...fields[index], min: field.value })}
                                                                type="number"
                                                                label={"Min"} />
                                                        }
                                                        control={control}
                                                        name={`sensors.${index}.min`}
                                                        defaultValue={item.min}
                                                    />


                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        render={
                                                            ({ field }) => <TextField
                                                                {...field}
                                                                // value={fields[index].min}
                                                                onBlur={() => update(index, { ...fields[index], max: field.value })}
                                                                type="number"
                                                                label={"Max"} />
                                                        }
                                                        control={control}
                                                        name={`sensors.${index}.max`}
                                                        defaultValue={item.max}
                                                    />

                                                </TableCell>
                                                <TableCell style={{ width: 180 }}>
                                                    <Controller

                                                        render={
                                                            ({ field }) => <Select {...field}
                                                                // onChange={() => update(index, { ...fields[index], graphType: field.value })}
                                                                fullWidth>
                                                                <MenuItem value={GraphType.Spline} selected>Spline</MenuItem>
                                                                <MenuItem value={GraphType.Bar}>Bar</MenuItem>
                                                                <MenuItem value={GraphType.BarColumn}>Bar Column</MenuItem>
                                                                <MenuItem value={GraphType.Line}>Line</MenuItem>
                                                            </Select>
                                                        }
                                                        control={control}
                                                        name={`sensors.${index}.graphType`}
                                                        defaultValue={GraphType.Spline}
                                                    />

                                                </TableCell>
                                                <TableCell align="center" style={{ width: 150 }}>


                                                    <Controller
                                                        render={
                                                            ({ field }) => (
                                                                <>

                                                                    {field.value ?

                                                                        <Grid container
                                                                            direction="row"
                                                                            justifyContent="center"
                                                                            alignItems="center">
                                                                            <Grid item >
                                                                                <img src={fields[index].icon}
                                                                                    style={{ maxHeight: 25, maxWidth: 25 }}
                                                                                    {...field}
                                                                                    alt={"Icon"}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <IconButton color="secondary" aria-label="upload picture" component="span"
                                                                                    onClick={() => update(index, { ...fields[index], icon: '' })}
                                                                                >
                                                                                    <Delete />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </Grid>
                                                                        :
                                                                        <>
                                                                            <input accept="image/*" hidden id={"icon-button-file" + index.toString()} type="file"
                                                                                onChange={(e) => handleIcon(e as any, index)}
                                                                            />
                                                                            <label htmlFor={"icon-button-file" + index.toString()}>
                                                                                <IconButton color="primary" aria-label="upload picture" component="span">
                                                                                    <Publish />
                                                                                </IconButton>
                                                                            </label>
                                                                        </>
                                                                    }
                                                                </>
                                                            )
                                                        }
                                                        control={control}
                                                        name={`sensors.${index}.icon`}
                                                        defaultValue={item.icon}
                                                    />

                                                    {/* 
                                                <Controller
                                                    control={control}
                                                    name={`sensors.${index}.icon`}
                                                    render={
                                                        ({ field }) => <>

                                                            {field.value ?

                                                                <Grid container
                                                                    direction="row"
                                                                    justifyContent="center"
                                                                    alignItems="center">
                                                                    <Grid item >
                                                                        <img src={fields[index].icon}
                                                                            style={{ maxHeight: 25, maxWidth: 25 }}
                                                                            {...field}
                                                                            alt={"Icon"}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <IconButton color="secondary" aria-label="upload picture" component="span">
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                                :
                                                                <>
                                                                    <input accept="image/*" hidden id={"icon-button-file" + index.toString()} type="file"
                                                                        onChange={(e) => handleIcon(e as any, index)}
                                                                    />
                                                                    <label htmlFor={"icon-button-file" + index.toString()}>
                                                                        <IconButton color="primary" aria-label="upload picture" component="span">
                                                                            <Publish />
                                                                        </IconButton>
                                                                    </label>
                                                                </>
                                                            }
                                                        </>
                                                    }
                                                /> */}
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

        </div>
    );
}
