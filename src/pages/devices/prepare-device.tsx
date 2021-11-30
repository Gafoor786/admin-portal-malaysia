import { Button, Grid, Stack, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { DeviceProps } from "./device";
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from "@components/custom-snack-bar";
import { AxiosResponse } from "axios";
import { post } from "@helpers/axiosInstance";
import { ErrorResponse, HttpUrls } from "@utilities/apis";
import { SuccessResponse } from "@interfaces/api-responses/success";
import { useHistory } from "react-router";
import DeviceJson from './test.json';



const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
}));

type FormValues = {
    name: string;
    description: string;
    deviceImage: File | null;
};

export default function PrepareDevice(props: DeviceProps) {

    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });
    const [loading, setLoading] = useState<boolean>(false);
    const submitBtn = useRef<HTMLButtonElement>(null);
    const {

        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            name: props.name,
            description: props.description,
            deviceImage: null
        },
        mode: "onBlur"
    });
    const [image, setImage] = useState('');


    const [logo, setLogo] = useState<File | null>(null);
    const history = useHistory();
    const onSubmit = (data: FormValues) => {

        props.name = data.name;
        props.description = data.description;
        props.deviceImage = logo;

        const msgs = [];
        if (!props.name) {
            msgs.push('Device name is mandatory')
        }
        if (!props.description) {
            msgs.push('Device description is mandatory')
        }
        if (!props.deviceImage && !props.isEditMode) {
            msgs.push('Device image is mandatory')
        }


        if (msgs.length === 0) {
            props.next();
            // submitDevice();
        } else {
            setAlertMessage({ msgType: AlertMsgTypes.Info, msgs: [...msgs] })
        }
    };


    const handleChange = (ev: any) => {
        const file = ev.target.files[0];
        setLogo(file);
        const reader = new FileReader();
        reader.addEventListener('load', (event: any) => {
            setImage(event.target.result);
        });
        reader.readAsDataURL(file as unknown as Blob);
    };


    useEffect(() => {
        setValue('name', props.name)
        setValue('description', props.description)
    }, [
        props.name, props.description
    ]);

    return (

        <div style={{ padding: 10 }}>
            {CustomizedSnackbars({ params: alertMessage })}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <Grid style={{ padding: 10 }}>
                    <Stack direction="column" spacing={1}>
                        {/* <TextField required

                            {...register('name')}
                            label={"Device Name"} sx={{ margin: (theme) => theme.spacing(1) }} /> */}
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextField
                                    sx={{ width: theme => theme.breakpoints.up('sm') ? 300 : '100%' }}
                                    label="Device Name"
                                    variant="filled"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                />
                            )}
                            rules={{ required: 'Device name required' }}
                        />



                        <br />

                        <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextField
                                    sx={{ width: theme => theme.breakpoints.up('md') ? 500 : '100%' }}
                                    label="Device Description"
                                    variant="filled"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    style={{ width: '100%', minWidth: 300 }}
                                    multiline
                                    rows={4}
                                    helperText={error ? error.message : null}
                                />
                            )}
                            rules={{ required: 'Device description required' }}
                        />
                        <br />

                    </Stack>

                </Grid>
                <button
                    type="submit"
                    ref={submitBtn}
                    hidden
                ></button>
            </form>
            <>
                <Button
                    variant="contained"
                    component="label"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                >
                    {image || props.isEditMode ? 'Change' : 'Upload'} Device Image
                    <input
                        type="file"
                        hidden
                        required
                        accept="image/*"
                        onChange={handleChange}
                    />
                </Button>
                <br />
                {
                    image ? <img src={image}

                        style={{ maxHeight: 250, marginTop: 15 }}

                        alt={"Icon"}
                    /> : null
                }
            </>

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
                    onClick={() => submitBtn.current?.click()}
                    disabled={loading}
                >
                    Next
                </StyledButtonBase>
            </div>

        </div>

    )
}
