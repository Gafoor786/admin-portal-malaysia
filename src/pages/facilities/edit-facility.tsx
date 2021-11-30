// import { DataGrid, GridCellValue, GridColDef, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Link as RouteLink, useHistory, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddFacility from './add-facility';
import { useEffect, useState } from 'react';
import { get } from '@helpers/axiosInstance';
import { HttpUrls, StatusCodes } from '@utilities/apis';
import { AxiosResponse } from 'axios';
import { DeviceConfig, DeviceConfigResponse } from '@interfaces/api-responses/device-config';
import { logout } from '@utilities/reducer';
import { useAuthContext } from '@utilities/State';
import { IUserType } from '@data/constants';
import { IFacility } from '@apiModels/facilities';
import { FacilityResponse } from '@interfaces/api-responses/facility';


const EditFacility: React.FC = () => {

    const { facilityId } = useParams<{ facilityId: string }>();
    const history = useHistory();
    const { state, dispatch } = useAuthContext();
    const [facility, setFacility] = useState<IFacility | null>(null);

    const getData = () => {
        if (facilityId) {
            get(history, `${HttpUrls.GET_FACILITY.replace('{facilityId}', facilityId)}`)
                .then((res: AxiosResponse<FacilityResponse>) => {
                    setFacility(res.data.Data);
                })
                .catch((error) => {
                    if (error.status === StatusCodes.UnAuthorized) {
                        logout(dispatch)
                    }
                    // const res = error.data as ErrorResponse;
                    // setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [res.ErrorMessage] })
                })
        }
    }


    useEffect(() => {
        console.log('Faciilty id ', facilityId)
        if (facilityId && (state.user?.userType === IUserType.Admin || state.user?.userType === IUserType.SuperAdmin)) {
            getData();
        }
    }, [facilityId]);

    if (facility)
        return (
            <div>

                <AddFacility facility={facility} />
            </div>
        );
    else return <div></div>
}

export default EditFacility;