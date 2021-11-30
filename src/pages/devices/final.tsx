


import { DeviceProps, DeviceRawConfig } from "./device";
import {
    Button
} from '@mui/material'
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from "@components/custom-snack-bar";
import { post, put } from "@helpers/axiosInstance";
import { HttpUrls, ErrorResponse, SuccessResponse } from "@utilities/apis";
import { AxiosResponse } from "axios";
import useApp from "@hooks/useApp";
import { useHistory } from "react-router";
import { downloadObjectAsJson } from "@utilities/util";
import { DeviceSuccessResponse } from "@interfaces/api-responses/device";
import { RouterLinks } from "@routes/route-uls";



const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
}));



const Final = (props: DeviceProps) => {

    const { setLoading } = useApp();
    const history = useHistory();
    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });

    const submit = async () => {

        const data = { ...props };

        const formData = new FormData();

        // Device first page
        formData.append('name', data.name);
        formData.append('description', data.description);

        if (data.deviceImage instanceof File) {
            formData.append('logo', data.deviceImage, data.deviceImage.name);
        }
        // End Device first page
        data.sensorsForm = [...data.sensorsForm.map(c => {
            const dashboardSelected = data.chooseSensors.find(v => v.key === c.key)?.selected;
            const priority = data.chooseSensors.find(v => v.key === c.key)?.priority;

            return {
                ...c,
                priority: priority,
                dashboardSelected: dashboardSelected
            }
        })]

        formData.append('sensors', JSON.stringify(data.sensorsForm));
        formData.append('events', JSON.stringify(data.eventsForm));
        formData.append('themeId', data.themeId.toString());
        formData.append('facilityId', data.facilityId.toString());
        formData.append('deviceId', data.deviceId.toString());
        // setAlertMessage({ msgType: AlertMsgTypes.Sucess, msgs: ['Random string inserted'] })

        if (!props.isEditMode) {
            AddDevice(formData);
        } else {
            EditDevice(formData)
        }

    }

    const AddDevice = async (formData: FormData) => {
        setLoading(true);
        await post(history, HttpUrls.ADD_DEVICE, formData)
            .then((res: AxiosResponse<DeviceSuccessResponse>) => {
                setLoading(false);

                const newRes = res.data;
                setAlertMessage({ msgType: AlertMsgTypes.Sucess, msgs: [newRes.Message] })
                if (props.rawConfig && props.rawConfig?.deviceData?.length > 0 && props.rawConfig?.deviceData?.[0]) {
                    const updatedConfig: DeviceRawConfig = {
                        ...props.rawConfig.deviceData[0],
                        id: res.data.Data.deviceId,
                        token: res.data.Data.token,
                        env: res.data.Data.env
                    };
                    downloadObjectAsJson(updatedConfig, res.data.Data.deviceId)
                }
                setTimeout(() => {
                    setLoading(false);
                    props.reset();
                }, 300);
                // history?.replace(RouterLinks.DASHBOARD)
            })
            .catch((error: any) => {
                setLoading(false);
                if (error.data) {
                    if (error.data instanceof Array) {
                        const res = error.data as ErrorResponse[];
                        setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [...res.map(c => c.ErrorMessage)] })
                    } else {
                        const res = error.data as ErrorResponse;
                        setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [res.ErrorMessage] })
                    }
                }
            })
    }

    const EditDevice = async (formData: FormData) => {
        setLoading(true);
        await put(history, HttpUrls.EDIT_DEVICE, formData)
            .then((res: AxiosResponse<DeviceSuccessResponse>) => {
                setLoading(false);

                const newRes = res.data;
                setAlertMessage({ msgType: AlertMsgTypes.Sucess, msgs: [newRes.Message] })
                history.push(RouterLinks.device.INDEX);
                // if (props.rawConfig && props.rawConfig?.deviceData?.length > 0 && props.rawConfig?.deviceData?.[0]) {
                //     const updatedConfig: DeviceRawConfig = {
                //         ...props.rawConfig.deviceData[0],
                //         id: res.data.Data.deviceId,
                //         token: res.data.Data.token,
                //         env: res.data.Data.env
                //     };
                //     downloadObjectAsJson(updatedConfig, res.data.Data.deviceId)
                // }
                // setTimeout(() => {
                //     setLoading(false);
                //     props.reset();
                // }, 300);
                // history?.replace(RouterLinks.DASHBOARD)
            })
            .catch((error: any) => {
                setLoading(false);
                if (error.data) {
                    if (error.data instanceof Array) {
                        const res = error.data as ErrorResponse[];
                        setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [...res.map(c => c.ErrorMessage)] })
                    } else {
                        const res = error.data as ErrorResponse;
                        setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [res.ErrorMessage] })
                    }
                }
            })
    }

    return (
        <div style={{ marginBottom: 10 }}>
            {CustomizedSnackbars({ params: alertMessage })}
            <StyledButtonBase
                onClick={() => props.back()}
            >
                Back
            </StyledButtonBase>
            <StyledButtonBase
                variant="contained"
                color="primary"

                onClick={submit}

            >
                {props.isEditMode ? 'Update Final Confirguration' : 'Download Final Confirguration'}
            </StyledButtonBase>
        </div>
    );
}


export default Final;