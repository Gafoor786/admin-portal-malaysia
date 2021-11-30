import React, { Fragment, ReactPropTypes, useEffect, useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import clsx from 'clsx';
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
import { post } from '@helpers/axiosInstance';
import { ErrorResponse, HttpUrls, StatusCodes } from '@utilities/apis';
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from '@components/custom-snack-bar';
import { useHistory } from 'react-router';
import { RouterLinks } from "@routes/route-uls";
import { AxiosResponse } from 'axios';
import { SuccessResponse } from '@interfaces/api-responses/success';
import { styled } from '@mui/material/styles';
import { VendorListResponse } from '@interfaces/api-responses/vendors';
import { IVendor } from '@apiModels/vendors';
import { logout } from '@utilities/reducer';
import { SaveOutlined } from '@mui/icons-material';
import { IUserType } from '@data/constants';


const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    textDecoration: 'none'
}));

const StyledRouteLink = styled(RouteLink)(() => ({
    textDecoration: 'none'
}));

const AddAdmin = () => {
    const { state, dispatch } = useAuthContext();
    const { setLoading } = useApp();
    const history = useHistory();
    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });
    const [vendorId, setVendorId] = useState<string>('');
    const [vendors, setVendors] = useState<IVendor[]>([]);

    const validationSchema = Yup.object().shape({
        emailId: Yup.string()
            .required('Email Id is required')
            .email('Email Id is invalid'),
        // password: Yup.string()
        //     .required('Password is required')
        //     .min(6, 'Password must be at least 6 characters')
        //     .max(40, 'Password must not exceed 40 characters'),
        firstName: Yup.string()
            .required('First Name is required')
            .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
            .max(20, 'First Name Must contain 20 characters only'),
        lastName: Yup.string()
            .required('Last Name is required')
            .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
            .max(20, 'Last Name Must contain 20 characters only'),
        vendorId: Yup.string(),
        userType: Yup.number()
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

    const onSubmit = async (data: any) => {
        data.vendorId = vendorId;
        data.userType = data.isSuperAdmin === true ? IUserType.SuperAdmin : IUserType.Admin;

        setLoading(true);
        await post(history, HttpUrls.ADD_ADMIN, data)
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
            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
            >
                <StyledRouteLink to={RouterLinks.admin.LIST}>
                    <StyledButtonBase variant="contained" color="primary" >
                        Admin List
                    </StyledButtonBase>
                </StyledRouteLink>

            </Grid>
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
                                            id="firstName"
                                            label="First Name"
                                            type="firstName"
                                            fullWidth
                                            margin="dense"
                                            {...register('firstName')}
                                            error={errors.firstName ? true : false}

                                        />
                                        <Typography variant="inherit" color="textSecondary">
                                            {errors.firstName?.message}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={6} md={6}>
                                        <TextField
                                            required
                                            id="lastName"
                                            label="Last Name"
                                            type="lastName"
                                            fullWidth
                                            margin="dense"
                                            {...register('lastName')}
                                            error={errors.lastName ? true : false}

                                        />
                                        <Typography variant="inherit" color="textSecondary">
                                            {errors.lastName?.message}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={6} md={6}>

                                        <TextField
                                            required
                                            id="emailId"
                                            label="Email Id"
                                            fullWidth
                                            margin="dense"
                                            {...register('emailId')}
                                            // defaultValue="superadmin@vendor1.com.my"
                                            error={errors.emailId ? true : false}
                                        />
                                        <Typography variant="inherit" color="textSecondary">
                                            {errors.emailId?.message}
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
                                    {
                                        state && state.user && state.user.userType === IUserType.SuperAdmin ?
                                            <Grid item xs={12} sm={12} lg={12} md={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Controller
                                                            control={control}
                                                            name="isSuperAdmin"
                                                            defaultValue={false}
                                                            // inputRef={register()}
                                                            render={({ field: { onChange } }) => (
                                                                <Checkbox
                                                                    color="primary"
                                                                    onChange={e => onChange(e.target.checked)}
                                                                />
                                                            )}
                                                        />
                                                    }
                                                    label={
                                                        <Typography color={errors.isSuperAdmin ? 'error' : 'inherit'}>
                                                            Is Super Admin
                                                        </Typography>
                                                    }
                                                />

                                            </Grid> : null
                                    }

                                </Grid>
                                <Box textAlign='center'>
                                    <Typography variant="inherit" >
                                        Note: Default password is set to <b>Password@123</b>
                                    </Typography>
                                </Box>
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
                                        Save
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

export default AddAdmin;