// import { DataGrid, GridCellValue, GridColDef, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Link as RouteLink, useHistory, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import DeviceOnboard from './DeviceOnboard';
import { useEffect, useState } from 'react';
import { get } from '@helpers/axiosInstance';
import { ErrorResponse, HttpUrls, StatusCodes } from '@utilities/apis';
import { AxiosResponse } from 'axios';
import { DeviceConfig, DeviceConfigResponse } from '@interfaces/api-responses/device-config';
import { logout } from '@utilities/reducer';
import { useAuthContext } from '@utilities/State';
import { IUserType } from '@data/constants';
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from '@components/custom-snack-bar';


const EditDevice: React.FC = () => {

    const { deviceId } = useParams<{ deviceId: string }>();
    const history = useHistory();
    const { state, dispatch } = useAuthContext();
    const [deviceConfig, setDeviceConfig] = useState<DeviceConfig | null>(null);
    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });

    const getConfig = () => {
        if (deviceId) {
            get(history, `${HttpUrls.GET_DEVICE_CONFIG_BY_ID.replace('{deviceId}', deviceId)}`)
                .then((res: AxiosResponse<DeviceConfigResponse>) => {
                    setDeviceConfig(res.data.Data);
                })
                .catch((error) => {

                    if (error.status === StatusCodes.UnAuthorized) {
                        logout(dispatch)
                    }
                    else {
                        const res = error.data as ErrorResponse[];
                        setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [...res.map(v => v.ErrorMessage)] })
                    }
                })
        }
    }


    useEffect(() => {
        if (deviceId && (state.user?.userType === IUserType.Admin || state.user?.userType === IUserType.SuperAdmin)) {
            getConfig();
        }
    }, [deviceId]);

    return <>
        {CustomizedSnackbars({ params: alertMessage })}
        {deviceConfig ? <DeviceOnboard deviceConfig={deviceConfig} /> : null}
    </>
}

export default EditDevice;