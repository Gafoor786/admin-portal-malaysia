import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Link as RouteLink, useHistory } from 'react-router-dom';

import {
    Grid, Stepper, Step, StepLabel, StepContent, Button, Paper, Typography
} from '@mui/material'
import { DeviceDataSection, DeviceProps, EventFormProps, ExistingEventFormProps, ExistingSensorFormProps, initialDeviceProps, SensorFormProps } from './device';
import AddEvents from './add-events';
import AddSensorsNew, { GraphType } from './add-sensors';
import ChooseSensors from './choose-sensors';
import ChooseTheme from './choose-theme';
import PrepareDevice from './prepare-device';
import Final from './final';
import DeviceImageWithSensorConfig from './device-img-sensor';
import { styled } from '@mui/material/styles';
import { RouterLinks } from '@routes/route-uls';
import { DeviceConfig } from '@interfaces/api-responses/device-config';
import { get } from '@helpers/axiosInstance';
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from '@components/custom-snack-bar';


function getSteps() {
    return ['Upload Device Configuration', 'Devices', 'Sensors', 'Events', 'Map Sensors to Device', 'Select Sensors', 'Choose Theme', 'Final the configuration'];
}

function getStepContent(step: number, props: DeviceProps, dispatch: Dispatch<SetStateAction<DeviceProps>>) {
    switch (step) {
        case 0:
            return UploadFileContent(props, dispatch);
        // return SelectDeviceTheme(props);
        case 1:
            return PrepareDevice(props);
        case 2:
            return AddSensorsNew(props);
        // return PrepareSensors(props);
        case 3:
            return AddEvents(props);
        case 4:
            return DeviceImageWithSensorConfig(props);
        case 5:
            return ChooseSensors(props)
        case 6:
            return ChooseTheme(props);
        case 7:
            return Final(props);
        case 8:
            return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`;
        default:
            return 'Unknown step';
    }
}

const StyledRouteLink = styled(RouteLink)(({ theme }) => ({
    textDecoration: 'none'
}));

const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    textDecoration: 'none'
}));

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    deviceConfig?: DeviceConfig;
}

const DeviceOnboard: React.FC<Props> = (existingConfig?: Props) => {

    const history = useHistory();
    const [activeStep, setActiveStep] = React.useState(0);

    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setConfigData(
            {
                ...initialDeviceProps,
                back: handleBack,
                next: handleNext,
                reset: handleReset
            }
        )
    };


    const [configData, setConfigData] = React.useState<DeviceProps>(
        {
            ...initialDeviceProps,
            back: handleBack,
            next: handleNext,
            reset: handleReset
        }
    );

    useEffect(() => {
        if (existingConfig && existingConfig.deviceConfig) {

            setActiveStep(1);
            console.log(existingConfig.deviceConfig.imagePath)
            setConfigData({
                ...configData,
                isEditMode: true,
                deviceId: existingConfig.deviceConfig.deviceId,
                name: existingConfig.deviceConfig.deviceName,
                description: existingConfig.deviceConfig.description,
                // deviceImage: file,
                imagePath: existingConfig.deviceConfig.imagePath,
                existingSensors: [
                    ...existingConfig.deviceConfig.sensors.map(c => {

                        const obj: ExistingSensorFormProps = {
                            dashboardSelected: c.dashboard,
                            graphType: c.graphType as GraphType,
                            icon: c.icon,
                            key: c.mappingKey,
                            max: c.max,
                            min: c.min,
                            name: c.sensorName,
                            priority: c.priority,
                            unit: c.unit,
                            id: c.sensorId,
                            sensorId: c.sensorId
                        }
                        return obj;
                    })
                ],
                existingEvents: [
                    ...existingConfig.deviceConfig.events.map(c => {
                        const js = JSON.parse(c.enumList);
                        const obj: ExistingEventFormProps = {
                            enumObj: {},
                            enumsStr: Object.entries(js).map(c => `${c[0]} : ${c[1]}`).join('\n'),
                            key: c.mappingKey,
                            name: c.name,
                            id: c.eventId,
                            eventId: c.eventId
                        }
                        return obj;
                    })
                ]
            })
        }
    }, [existingConfig]);

    return (
        <div >
            {
                !configData.isEditMode ? <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                >

                    <StyledRouteLink to={RouterLinks.device.LIST}>
                        <StyledButtonBase variant="contained" color="primary" >
                            Device List
                        </StyledButtonBase>
                    </StyledRouteLink>
                </Grid> : null
            }
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {getStepContent(index, configData, setConfigData)}
                            {/* <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    {
                                        activeStep === 2 || activeStep === 3 ?
                                            null : <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleNext}
                                                className={classes.button}
                                            >
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                    }
                                </div>
                            </div> */}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} >
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} >
                        Reset
                    </Button>
                </Paper>
            )}
        </div>
    );
}


function UploadFileContent(props: DeviceProps, dispatch: Dispatch<SetStateAction<DeviceProps>>) {
    // const [files, setFiles] = useState<DeviceRawConfig | null>(null);
    // const uploadFile = useRef<HTMLInputElement>(null);
    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });
    const handleChange = (ev: any) => {
        const fileReader = new FileReader();
        fileReader.readAsText(ev.target.files[0], "UTF-8");
        fileReader.onload = (e: any) => {
            try {
                // console.log(JSON.parse(e.target.result))
                // setFiles(JSON.parse(e.target.result) as DeviceRawConfig);
                props.rawConfig = JSON.parse(e.target.result) as DeviceDataSection;
                dispatch({
                    ...props,
                    rawConfig: JSON.parse(e.target.result) as DeviceDataSection
                })
                props.next();
            } catch {
                setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: ["Invalid structure found in json configuration"] })
            }
        };
    };

    // useEffect(() => {
    //     if (files) {


    //     }

    // }, [files]);
    return (
        <Paper>
            {CustomizedSnackbars({ params: alertMessage })}
            <Grid style={{ padding: 10 }}>
                <Button
                    variant="contained"
                    component="label"
                // onClick={() => uploadFile.current?.click()}
                >
                    Upload Json File
                    <input
                        // ref={uploadFile}
                        type="file"
                        hidden
                        accept="application/JSON"
                        onChange={handleChange}
                    />
                </Button>

            </Grid>


        </Paper>

    )
}


export default DeviceOnboard




