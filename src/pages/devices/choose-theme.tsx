import * as React from "react";
import { useForm } from "react-hook-form";
import { DeviceProps, flattenObject } from "./device";
import {
    Grid, Button, Autocomplete, TextField
} from '@mui/material'
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import './theme-styles.scss'
import ThemeList from "./themes-list";
import { ThemeData } from "./themes/theme";
import { post } from "@helpers/axiosInstance";
import { useAuthContext } from "@utilities/State";
import { IUserType } from "@data/constants";
import { useHistory } from "react-router";
import { ErrorResponse, HttpUrls, StatusCodes } from "@utilities/apis";
import { VendorListResponse } from "@interfaces/api-responses/vendors";
import { logout } from "@utilities/reducer";
import { IVendor } from "@apiModels/vendors";
import { AxiosResponse } from "axios";
import { Box } from "@mui/system";
import { IFacility } from "@apiModels/facilities";
import { FacilityListResponse } from "@interfaces/api-responses/facility";
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
    themeId: number;
    facilityId: string;
};

export default function ChooseTheme(props: DeviceProps) {

    const [selected, setSelected] = React.useState(-1);
    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            themeId: 0,
            facilityId: ''
        },
        mode: "onBlur"
    });

    const onSubmit = (data: FormValues) => {

        if (!facilityId) {
            setAlertMessage({ msgType: AlertMsgTypes.Info, msgs: ['Please choose facility'] })
        } else if (selected === -1) {
            setAlertMessage({ msgType: AlertMsgTypes.Info, msgs: ['Please choose theme'] })
        } else {
            props.themeId = selected;
            props.facilityId = facilityId;
            props.next();
        }

    };


    const onClick = (id: number) => {
        try {

            setSelected(id);
        } catch {
            // valuesEvents.push({
            //     key: key,
            //     enumsObj: {}
            // });
        }

    }
    const history = useHistory();
    const { state, dispatch } = useAuthContext();
    const [facilities, setFacilities] = useState<IFacility[]>([]);
    const [facilityId, setFacilityId] = useState<string>('');


    const [themes, setThemes] = React.useState<ThemeData[]>([]);
    useEffect(() => {
        let unmounted = false;
        if (!unmounted && state.user?.userType === IUserType.Admin) {
            const pg = {
                pageSize: 10,
                currentPage: 1
            }
            post(history, HttpUrls.FACILITY_LIST_ALL, pg)
                .then((res: AxiosResponse<FacilityListResponse>) => {
                    setFacilities(res.data?.Data.map(obj => ({ ...obj, id: obj.facilityId })))
                    // history?.replace(RouterLinks.DASHBOARD)
                })
                .catch((error) => {
                    console.error(error)
                    const data: ErrorResponse = error.data;
                    if (error.status === StatusCodes.UnAuthorized) {
                        logout(dispatch)
                    } else if (error.status === StatusCodes.InternalServerError) {
                        setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [data.ErrorMessage] })
                    }
                    // const res = error.data as ErrorResponse;
                    // 
                })
        }
        return () => {
            unmounted = true;
        };
    }, [

    ]);


    useEffect(() => {
        const res = ThemeList[[...props.chooseSensors.filter(v => v.selected === true)].length * 100]
        setThemes(res)
        setSelected(-1);
        if (props.isEditMode) {
            // setValue('facilityId', props.facilityId);
            // setFacilityId(props.facilityId)
            // // setValue('themeId', props.themeId);
            // setSelected(props.themeId);
        }
        return () => {

        };
    }, [
        props.chooseSensors
    ]);

    return (
        <div>
            {CustomizedSnackbars({ params: alertMessage })}
            {
                themes && themes.length > 0 ?
                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="none">
                        <Grid container sx={{ marginBottom: (theme) => theme.spacing(2) }}>
                            <Grid item xs={12} sm={12} lg={4} md={6}>
                                <Autocomplete
                                    id="vendors-list"
                                    // sx={{ width: 300 }}
                                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                                    options={facilities}
                                    autoHighlight
                                    {...register('facilityId')}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event: any, newValue: IFacility | null) => {
                                        setFacilityId(newValue ? newValue.facilityId : '');
                                    }}

                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {/* <img
                                                    loading="lazy"
                                                    width="20"
                                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                    alt=""
                                                /> */}
                                            {option.name}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Choose Facility"

                                            inputProps={{
                                                ...params.inputProps,
                                                // autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className="images-list">
                            {
                                themes.map((item, i) => {
                                    // const image = require(`./assets/templates/500/500-1-light.png`);

                                    return <Grid item key={i.toString()}>
                                        <img
                                            src={item.img}
                                            className={item.id === selected ? 'active' : ''}
                                            // srcSet={`${item.img}`}
                                            alt={item.name}
                                            onClick={(e) => onClick(item.id)}
                                            loading="lazy"
                                        />
                                    </Grid>
                                })
                            }
                        </Grid>


                        {/* <ImageList cols={3} gap={10} rowHeight={164}>
                    {themes.map((item) => (
                        <ImageListItem key={item.img} >
                            <img
                                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                alt={item.title}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList> */}
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
                    : <p>No themes available</p>
            }

        </div>

    );


}
