import React, { Fragment, ReactPropTypes, useEffect, useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IVendor } from 'apiModels/models/vendors'

// import FormData from 'form-data';
import * as Yup from 'yup';
import {
    Paper,
    Box,
    Grid,
    TextField,
    Typography,
    Button,
} from '@mui/material';
import { useAuthContext } from '@utilities/State';
import useApp from '@hooks/useApp';
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from '@components/custom-snack-bar';
import { useHistory } from 'react-router';
import { RouterLinks } from "@routes/route-uls";
import { SaveOutlined } from '@mui/icons-material';


// New import for style and makeStyles
import { styled } from '@mui/material/styles';
import { post } from '@helpers/axiosInstance';
import { HttpUrls, ErrorResponse } from '@utilities/apis';
import { AxiosResponse } from 'axios';
import { SuccessResponse } from '@interfaces/api-responses/success';


const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    textDecoration: 'none'
}));

const StyledRouteLink = styled(RouteLink)(() => ({
    textDecoration: 'none'
}));

const AddVendor = () => {
    const { state } = useAuthContext();
    const { setLoading } = useApp();
    const history = useHistory();

    const [logo, setLogo] = useState<File | string>('');
    const [image, setImage] = useState('');
    const [vendors, setVendors] = useState<IVendor[]>([]);

    const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .max(120, 'Domain name must contain 120 characters only')
            .required('Company name is required'),
        // password: Yup.string()
        //     .required('Password is required')
        //     .min(6, 'Password must be at least 6 characters')
        //     .max(40, 'Password must not exceed 40 characters'),
        domainId: Yup.string()
            .required('Domain id is required')
            .matches(/^[@]{1}(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/, 'Please enter valid domain id')
            .max(120, 'Domain id must contain 120 characters only'),
        address: Yup.string()
            .required('Company address is required')
            .matches(/[\w',-\\/.\s]/, 'Please enter valid address')
            .max(1200, 'Company address Must contain 1200 characters only'),
        logo: Yup
            .mixed()
        // logo: Yup
        //     .mixed()
        //     .required("You need to provide a file")
        //     .test("fileSize", "The file is too large", (value) => {
        //         return value && value[0].size <= 2000000;
        //     })
        //     .test("type", "We only support jpeg/png", (value) => {
        //         return value && (value[0].type === "image/jpeg" || value[0].type === "image/png");
        //     }),
    });
    const {
        register,
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
    const onChange = (ev: any) => {
        setLogo(ev.target.files[0]);
        const reader = new FileReader();
        reader.addEventListener('load', (event: any) => {
            setImage(event.target.result);
        });
        reader.readAsDataURL(ev.target.files[0] as unknown as Blob);

    }


    const onSubmit = async (data: any) => {
        delete data?.logo;
        const formData = new FormData();
        Object.keys(data).forEach((c: string) => {
            formData.append(c, data[c]);
        })
        if (logo instanceof File) {
            formData.append('logo', logo, logo.name);
        }


        await post(history, HttpUrls.ADD_VENDOR, formData,
            { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((res: AxiosResponse<SuccessResponse>) => {
                setLoading(false);
                const newRes = res.data as SuccessResponse;
                setAlertMessage({ msgType: AlertMsgTypes.Sucess, msgs: [newRes.Message] })
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

                <StyledRouteLink to={RouterLinks.vendor.LIST}>
                    <StyledButtonBase variant="contained" color="primary" >
                        Vendor List
                    </StyledButtonBase>
                </StyledRouteLink>
            </Grid>
            {/* <h4>Update to Add Form for Admin (remove login form here)</h4> */}

            <form autoComplete="off" onSubmit={dummySubmit}>
                <Fragment>
                    <Paper>
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
                                        label="Company Name"
                                        type="text"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 120
                                        }}
                                        margin="dense"
                                        {...register('name')}
                                        error={errors.name ? true : false}

                                    />
                                    <Typography variant="inherit" color="textSecondary">
                                        {errors.name?.message}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={12} lg={6} md={6}>

                                    <TextField
                                        required
                                        id="domainId"
                                        label="Domain Id"
                                        placeholder="@yourdomain.com"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 120
                                        }}
                                        margin="dense"
                                        {...register('domainId')}
                                        // defaultValue="superadmin@vendor1.com.my"
                                        error={errors.domainId ? true : false}
                                    />
                                    <Typography variant="inherit" color="textSecondary">
                                        {errors.domainId?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} lg={12} md={12}>
                                    <TextField
                                        required
                                        id="address"
                                        label="Company Address"
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

                                    />
                                    <Typography variant="inherit" color="textSecondary">
                                        {errors.address?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} lg={6} md={6}>

                                    <>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            sx={{ marginTop: (theme) => theme.spacing(2) }}
                                        >
                                            {image ? 'Change' : 'Upload'} Company logo
                                            <input
                                                type="file"
                                                hidden
                                                {...register('logo')}
                                                required
                                                accept="image/*"
                                                onChange={onChange}
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
                                </Grid>

                            </Grid>

                            <Box mt={3} textAlign='center'>
                                <StyledButtonBase
                                    variant="contained"
                                    color="inherit"
                                    sx={{ color: (theme) => theme.palette.secondary.contrastText }}
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

                                    startIcon={<SaveOutlined />}
                                >
                                    Save
                                </StyledButtonBase>

                            </Box>

                        </Box>

                    </Paper>
                </Fragment>
            </form>

        </>

    );
};

export default AddVendor;