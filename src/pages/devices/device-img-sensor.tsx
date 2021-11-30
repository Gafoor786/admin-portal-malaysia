import { Button, Grid, Paper, TextField, Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { DeviceProps } from "./device";
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from "@components/custom-snack-bar";
import { AxiosResponse } from "axios";
import { post } from "@helpers/axiosInstance";
import { ErrorResponse, HttpUrls } from "@utilities/apis";
import { SuccessResponse } from "@interfaces/api-responses/success";
import { useHistory } from "react-router";
import DeviceJson from './test.json';
import Draggable from "react-draggable";



const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: 'white',
    background: 'white',
    color: 'black'
}));

type FormValues = {
    name: string;
    description: string;
    deviceImage: File | null;
};

export default function DeviceImageWithSensorConfig(props: DeviceProps) {

    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });

    const [image, setImage] = useState(props.imagePath);
    useEffect(() => {


        if (props.deviceImage) {
            const reader = new FileReader();
            reader.addEventListener('load', (event: any) => {
                setImage(event.target.result);
            });
            reader.readAsDataURL(props.deviceImage as unknown as Blob);

        }
    }, [
        props.deviceImage
    ]);

    return (

        <div style={{ padding: 10 }}>
            {CustomizedSnackbars({ params: alertMessage })}
            <Grid container spacing={2}>

                <Grid item sm>
                    {
                        props.sensorsForm.map((c, i) => {
                            return <Draggable bounds="parent" key={i.toString()}>
                                <div className="box">
                                    {c.name}
                                </div>
                            </Draggable>
                        })
                    }
                    {
                        image ? <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"

                            sx={{ margin: (theme) => theme.spacing(2, 0, 2, 0), }}
                        >
                            <img className="device-img" alt="Company logo" src={image}

                            />
                        </Box>
                            : props.imagePath ?
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ margin: (theme) => theme.spacing(2, 0, 2, 0), }}

                                >

                                    <img className="device-img" alt="Company logo" src={props.imagePath}

                                    />
                                </Box>
                                : null
                    }
                </Grid>

                {/* <Grid item lg={6} >
                    {
                        props.sensorsForm.map((c, i) => {
                            return <StyledPaper key={i.toString()} >

                                <Draggable bounds="parent" >
                                    <div className="box">
                                        {c.name}
                                    </div>
                                </Draggable>
                            </StyledPaper>
                        })
                    }
                </Grid> */}
            </Grid>
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
                    onClick={() => props.next()}
                // disabled={loading}
                >
                    Next
                </StyledButtonBase>
            </div>
        </div>

    )
}
