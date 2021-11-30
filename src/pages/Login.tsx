import React, { Fragment, ReactPropTypes, useEffect, useRef, useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Logo from '../assets/images/splash_logo.png'
import { yupResolver } from '@hookform/resolvers/yup';
import { StorageKeys } from '@data/constants'
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
    Link,
    Autocomplete
} from '@mui/material';
import { useAuthContext } from '@utilities/State';
import useApp from '@hooks/useApp';
import { get, post } from '@helpers/axiosInstance';
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
import { useTranslation } from "react-i18next";
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { LoginResponse } from '@interfaces/api-responses/login';
import { ActionType } from '@utilities/actions';
import { User } from '@utilities/iAuth';
import { LoginRequest } from '@interfaces/login';
import { Save } from '@utilities/storage';


const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    textDecoration: 'none'
}));

const StyledRouteLink = styled(RouteLink)(() => ({
    textDecoration: 'none'
}));
const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        // marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        // margin: theme.spacing(1),
        // backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing(1),
    },
    submit: {
        // margin: theme.spacing(3, 0, 2),
    },
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Login = () => {
    const { t, i18n } = useTranslation('common');
    const classes = useStyles();
    const { state, dispatch } = useAuthContext();
    const { setLoading } = useApp();
    const history = useHistory();
    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });
    const loginBtn = useRef<HTMLButtonElement>(null);

    const validationSchema = Yup.object().shape({
        emailId: Yup.string()
            .required('Email Id is required')
            .email('Email Id is invalid'),
        // password: Yup.string()
        //     .required('Password is required')
        //     .min(6, 'Password must be at least 6 characters')
        //     .max(40, 'Password must not exceed 40 characters'),
        password: Yup.string()
            // .default('password@123')
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(40, 'Password must not exceed 40 characters'),

        rememberMe: Yup.bool()
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
        // sampleApi();
        return () => {
        };
    }, []);

    const dummySubmit = (event: any) => {
        event.preventDefault();
    }

    const resetForm = () => {
        return reset();
    }
    const keyPress = (e: any) => {
        if (e.keyCode === 13) {
            // console.log('value', e.keyCode);
            // put the login here
            loginBtn.current?.click();
        }
    }

    useEffect(() => {
        if (state?.authenticated) {
            history?.replace(RouterLinks.DASHBOARD)
        }

        return () => {
        };
    }, [history, state]);

    const onSubmit = async (data: LoginRequest) => {

        setLoading(true);
        await post(history, HttpUrls.LOGIN, data)
            .then((res: AxiosResponse<LoginResponse>) => {
                const obj = res.data.Data as User;
                Save(StorageKeys.TOKEN, obj.token)
                dispatch({ type: ActionType.LoggedIn, payload: obj })
                setLoading(false);


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
    const sampleApi = async () => {

        await get(history, HttpUrls.SAMPLE_GET)
            .then((res: any) => {

                Save(StorageKeys.TOKEN, res.data.Data.tokenTest)

                tokenTest();
                // history?.replace(RouterLinks.DASHBOARD)
            })
            .catch((error) => {

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
    const tokenTest = async () => {

        await post(history, HttpUrls.SAMPLE_TOKEN_GET, {})
            .then((res: AxiosResponse<LoginResponse>) => {
                console.log(res.data)


                // history?.replace(RouterLinks.DASHBOARD)
            })
            .catch((error) => {

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
            <Container maxWidth="sm" >
                <CustomizedSnackbars params={alertMessage} />
                <div className={classes.paper} >
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"

                    >
                        <img src={Logo} alt='Logo' style={{ height: 100 }} />
                    </Box>
                    <Typography component="h1" variant="h5">
                        {t('login.sign-in')}
                        {/* <h1>{t('login.title', { framework: 'React' })}</h1> */}
                    </Typography>
                </div>
                {/* <h4>Update to Add Form for Admin (remove login form here)</h4> */}

                <form autoComplete="off" className={classes.form} onSubmit={dummySubmit}>
                    <Fragment>

                        <Container maxWidth="md">
                            <Box px={3} py={2} maxWidth="md">


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
                                <Typography variant="inherit" color="error.main">
                                    {errors.emailId?.message}
                                </Typography>

                                <TextField
                                    required
                                    id="password"
                                    type="password"
                                    label="Password"
                                    fullWidth
                                    margin="dense"
                                    onKeyDown={keyPress}
                                    {...register('password')}
                                    // defaultValue="superadmin@vendor1.com.my"
                                    error={errors.password ? true : false}
                                />
                                <Typography variant="inherit" color="error.main">
                                    {errors.password?.message}
                                </Typography>


                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label={t('login.remember-me')}
                                />
                                <Box mt={3} >

                                    <StyledButtonBase
                                        variant="contained"
                                        color="primary"
                                        // type="submit"
                                        ref={loginBtn}
                                        onClick={handleSubmit(onSubmit)}
                                        fullWidth
                                    // size="small"
                                    // className={classes.button}
                                    // startIcon={<SaveOutlined />}
                                    >
                                        Submit
                                    </StyledButtonBase>
                                    <Box
                                        display="flex"
                                        justifyContent="end"
                                        alignItems="end"
                                        mt={2}

                                    >
                                        <Link href="#" variant="body2">
                                            {t('login.forgot-password')}
                                        </Link>
                                    </Box>

                                </Box>
                            </Box>

                        </Container>

                    </Fragment>
                </form>
                <Box mt={8}>
                    Admin Login Env: {process.env.REACT_APP_CUSTOM_ENV} {process.env.REACT_APP_IS_LOCAL}
                    <Copyright />
                </Box>
            </Container>
        </>

    );
};

export default Login;