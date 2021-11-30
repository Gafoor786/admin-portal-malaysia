import React, { Fragment, ReactPropTypes, useEffect, useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
    Paper,
    Box,
    Grid,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
    Container,
    Autocomplete
} from '@mui/material';
import { useAuthContext } from '@utilities/State';
import useApp from '@hooks/useApp';
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from '@components/custom-snack-bar';
import { useHistory } from 'react-router';
import { RouterLinks } from "@routes/route-uls";
import { SaveOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { IVendor } from '@apiModels/vendors';
import { IUserType } from '@data/constants';
import { post } from '@helpers/axiosInstance';
import { VendorListResponse } from '@interfaces/api-responses/vendors';
import { ErrorResponse, HttpUrls, StatusCodes } from '@utilities/apis';
import { SuccessResponse } from '@interfaces/api-responses/success';
import { logout } from '@utilities/reducer';
import { AxiosResponse } from 'axios';
import { IFacility } from '@apiModels/facilities';

const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    textDecoration: 'none'
}));

const StyledRouteLink = styled(RouteLink)(({ theme }) => ({
    textDecoration: 'none'
}));

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    facility?: IFacility;
}

const AddFacility: React.FC<Props> = (existingConfig?: Props) => {
    const { state, dispatch } = useAuthContext();
    const { setLoading } = useApp();
    const history = useHistory();
    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [vendorId, setVendorId] = useState<string>('');
    const [configData, setConfigData] = useState<IFacility | null>(null);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .max(120, 'Facility name must contain 120 characters only')
            .required('Facility name is required'),
        // password: Yup.string()
        //     .required('Password is required')
        //     .min(6, 'Password must be at least 6 characters')
        //     .max(40, 'Password must not exceed 40 characters'),
        domainId: Yup.string(),
        address: Yup.string()
            .required('Facility address is required')
            .matches(/[\w',-\\/.\s]/, 'Please enter valid address')
            .max(1200, 'Facility address Must contain 1200 characters only'),
    });
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema)
    });
    useEffect(() => {
        return () => {
        };
    }, [history, state]);

    const dummySubmit = (event: any) => {
        event.preventDefault();
    }
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        // setAge(event.target.value as string);
    };

    const resetForm = () => {
        return reset();
    }


    useEffect(() => {
        let unmounted = false;
        if (!unmounted && state.user?.userType === IUserType.SuperAdmin) {
            const pg = {
                pageSize: 10,
                currentPage: 1
            }
            post(history, HttpUrls.VENDOR_LIST_ALL, pg)
                .then((res: AxiosResponse<VendorListResponse>) => {
                    setVendors(res.data?.Data.map(obj => ({ ...obj, id: obj.vendorId })))
                    // history?.replace(RouterLinks.DASHBOARD)
                })
                .catch((error) => {
                    console.error(error)
                    if (error.status === StatusCodes.UnAuthorized) {
                        logout(dispatch)
                    }
                    // const res = error.data as ErrorResponse;
                    // setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [res.ErrorMessage] })
                })
        }
        return () => {
            unmounted = true;
        };
    }, [

    ]);

    useEffect(() => {
        if (existingConfig && existingConfig.facility) {
            setConfigData({
                ...existingConfig.facility
            })
            setIsEditMode(true);
        }
    }, [existingConfig]);

    const onSubmit = async (data: any) => {
        data.vendorId = vendorId;
        setLoading(true);
        await post(history, HttpUrls.ADD_FACILITY, data)
            .then((res: AxiosResponse<SuccessResponse>) => {
                setLoading(false);
                resetForm();
                setVendorId('');
                const newRes = res.data as SuccessResponse;
                setAlertMessage({ msgType: AlertMsgTypes.Sucess, msgs: [newRes.Message] })
                // history?.replace(RouterLinks.DASHBOARD)
            })
            .catch((error) => {
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

                // dispatch({ type: ActionType.LoggedIn, payload: {} as User })

                // setMessage("Auth failure! Please create an account");
                // setIserror(true)
            })

    };
    return (
        // <Container maxWidth="md">
        <>
            <CustomizedSnackbars params={alertMessage} />
            {
                !isEditMode ? <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                >

                    <StyledRouteLink to={RouterLinks.facilities.LIST}>
                        <StyledButtonBase variant="contained" color="primary" >
                            Facilities List
                        </StyledButtonBase>
                    </StyledRouteLink>
                </Grid> : null
            }
            {/* <h4>Update to Add Form for Admin (remove login form here)</h4> */}

            <form autoComplete="off" onSubmit={dummySubmit}>
                <Fragment>
                    <Paper>
                        <Container maxWidth="md">
                            <Box px={3} py={2} maxWidth="md">

                                <Grid container spacing={1}>


                                    <Grid item xs={12} sm={12} lg={6} md={6}>
                                        {/* <FormControl>
                                        <InputLabel htmlFor="my-input">Email address</InputLabel>
                                        <Input id="my-input" aria-describedby="my-helper-text" />
                                        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                                    </FormControl> */}
                                        <TextField
                                            required
                                            id="name"
                                            label="Facility Name"
                                            type="text"
                                            fullWidth
                                            inputProps={{
                                                maxLength: 120
                                            }}
                                            margin="dense"
                                            {...register('name')}
                                            error={errors.name ? true : false}
                                            value={isEditMode ? configData?.name : ''}
                                        />
                                        <Typography variant="inherit" color="textSecondary">
                                            {errors.name?.message}
                                        </Typography>
                                    </Grid>



                                    {
                                        state && state.user && state.user.userType === IUserType.SuperAdmin ?
                                            <Grid item xs={12} sm={12} lg={6} md={6}>
                                                <Autocomplete
                                                    id="vendors-list"
                                                    // sx={{ width: 300 }}
                                                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                                                    options={vendors}
                                                    autoHighlight
                                                    {...register('vendorId')}
                                                    getOptionLabel={(option) => option.name}
                                                    onChange={(event: any, newValue: IVendor | null) => {
                                                        setVendorId(newValue ? newValue.vendorId : '');
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
                                                            label="Choose Vendor"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid> : null
                                    }
                                    <Grid item xs={12} sm={12} lg={12} md={12}>
                                        <TextField
                                            required
                                            id="address"
                                            label="Facility Address"
                                            type="text"
                                            fullWidth
                                            margin="dense"
                                            multiline
                                            inputProps={{
                                                maxLength: 1200
                                            }}
                                            rows={4}
                                            {...register('address')}
                                            error={errors.address ? true : false}
                                            value={isEditMode ? configData?.address : ''}

                                        />
                                        <Typography variant="inherit" color="textSecondary">
                                            {errors.address?.message}
                                        </Typography>
                                    </Grid>

                                </Grid>

                                <Box mt={3} textAlign='center'>
                                    <StyledButtonBase
                                        variant="contained"
                                        color="inherit"
                                        sx={{ color: (theme) => theme.palette.secondary.contrastText }}
                                        // className={classes.button}
                                        onClick={resetForm}

                                    // startIcon={<CloudUpload />}
                                    >
                                        Reset
                                    </StyledButtonBase>
                                    <StyledButtonBase
                                        variant="contained"
                                        color="primary"
                                        // type="submit"
                                        onClick={handleSubmit(onSubmit)}
                                        // size="small"
                                        // className={classes.button}
                                        startIcon={<SaveOutlined />}
                                    >
                                        {isEditMode ? 'Update' : 'Save'}
                                    </StyledButtonBase>

                                </Box>

                            </Box>
                            {/* <Typography variant="inherit" color="textSecondary">
                            {errors?}
                        </Typography> */}

                        </Container>
                    </Paper>
                </Fragment>
            </form>

        </>

    );
};

export default AddFacility;