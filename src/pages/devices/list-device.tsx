// import { DataGrid, GridCellValue, GridColDef, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Link as RouteLink } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { Box, Button, FormControl, Grid, Hidden, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { get, post } from '@helpers/axiosInstance';
import { HttpUrls, StatusCodes } from '@utilities/apis';
import { RouterLinks } from '@routes/route-uls';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { FacilityListResponse } from '@interfaces/api-responses/facility';
import { IFacility } from '@apiModels/facilities';
import { logout } from '@utilities/reducer';
import { IUserType } from '@data/constants';
import { useAuthContext } from '@utilities/State';
import { IDevice, IDeviceListResponse } from '@interfaces/api-responses/iDevice';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import MUIDataTable from 'mui-datatables';

const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    textDecoration: 'none'
}));

const StyledRouteLink = styled(RouteLink)(() => ({
    textDecoration: 'none'
}));

function DeviceList() {
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const history = useHistory();
    const { state, dispatch } = useAuthContext();
    const [facilities, setFacilities] = useState<IFacility[]>([]);
    const [devices, setDevices] = useState<IDevice[]>([]);
    const [facilityId, setFacilityId] = useState('');

    const options = {
        print: false
    };

    const columns = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
    ]

    const onEdit = (val: string) => {
        history.push(RouterLinks.device.EDIT.replace(':deviceId', val));
    }


    const formatDate = (val: Date) => {
        return moment(val).format('DD-MMM-yyyy HH:mm');
    }

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleFacilityChange = (event: SelectChangeEvent) => {
        setFacilityId(event.target.value as string);
        if (event.target.value) {
            getDevices(event.target.value);
        }
    };

    const getFacilities = () => {
        post(history, HttpUrls.FACILITY_LIST_ALL, {})
            .then((res: AxiosResponse<FacilityListResponse>) => {
                setFacilities(res.data.Data);
                // history?.replace(RouterLinks.DASHBOARD)
            })
            .catch((error) => {
                if (error.status === StatusCodes.UnAuthorized) {
                    logout(dispatch)
                }
                // const res = error.data as ErrorResponse;
                // setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [res.ErrorMessage] })
            })
    }

    const getDevices = (id: string) => {

        get(history, HttpUrls.DEVICES_BY_FACILITY_ID.replace('{facilityId}', id))
            .then((res: AxiosResponse<IDeviceListResponse>) => {
                setDevices(res.data.Data);
                // history?.replace(RouterLinks.DASHBOARD)
            })
            .catch((error) => {
                if (error.status === StatusCodes.UnAuthorized) {
                    logout(dispatch)
                }
                // const res = error.data as ErrorResponse;
                // setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [res.ErrorMessage] })
            })
    }


    useEffect(() => {
        let unmounted = false;
        if (!unmounted && (state.user?.userType === IUserType.Admin || state.user?.userType === IUserType.SuperAdmin)) {
            getFacilities();
        }
        return () => {
            unmounted = true;
        };
    }, [

    ]);

    // useEffect(() => {

    //     const pg = {
    //         pageSize: 10,
    //         currentPage: page
    //     }
    //     post(history, HttpUrls.ADMIN_LIST, pg)
    //         .then((res: AxiosResponse<DeviceFacilityResponse>) => {
    //             if (page === 1) {

    //                 setTotalCount(rem > 0 ? newPage + 1 : newPage);
    //             }
    //             if (res.data?.Data?)
    //                 setDeviceFacility(res.data?.Data)
    //             else
    //                 setDeviceFacility([])
    //             // history?.replace(RouterLinks.DASHBOARD)
    //         })
    //         .catch(() => {
    //             // setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [res.ErrorMessage] })
    //         })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [page]);

    return (
        <div>
            {/* <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/" >
                    Material-UI
                </Link>
                <Link color="inherit" href="/getting-started/installation/" >
                    Core
                </Link>
                <Typography color="textPrimary">Breadcrumb</Typography>
            </Breadcrumbs>
             */}

            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
            >
                <StyledRouteLink to={RouterLinks.device.ADD}>
                    <StyledButtonBase variant="contained" color="primary" >
                        Add Device
                    </StyledButtonBase>
                </StyledRouteLink>

            </Grid>
            {/* <button onClick={loadMoreCommit}>Load More Commits</button> */}

            <Box sx={{ minWidth: 120 }}>
                <Grid container>
                    <Grid item xs={12} sm={6} lg={3} md={4} sx={{ padding: (theme) => theme.spacing(1) }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="facility-label">Facilities</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={facilityId}
                                label="Facilities"
                                onChange={handleFacilityChange}
                            >
                                {
                                    facilities.map((c, index) => {
                                        return <MenuItem key={index.toString()} value={c.facilityId}>{c.name}</MenuItem>
                                    })
                                }
                                {/* <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem> */}
                            </Select>
                        </FormControl>

                    </Grid>

                </Grid>
            </Box>

            <div style={{ width: '100%' }}>
                <Paper>
                    {
                        devices.length > 0 ?
                            <TableContainer component={Paper}>
                                <Table sx={{
                                    // minWidth: 650 
                                }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Device Name</TableCell>
                                            <TableCell align="right">Created On (UTC)</TableCell>
                                            <TableCell align="right">Updated On (UTC)</TableCell>
                                            <TableCell align="right"> Action </TableCell>
                                            {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {devices.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{formatDate(row.createdOn)}</TableCell>
                                                <TableCell align="right">{formatDate(row.updatedOn)}</TableCell>
                                                <TableCell align="right">
                                                    <Hidden smDown>
                                                        <Stack direction="row" spacing={2}>
                                                            {/* <Button variant="contained" endIcon={<SendIcon />}>
                                                                Send
                                                            </Button> */}
                                                            <Button variant="contained" color="warning" onClick={() => onEdit(row.deviceId)} startIcon={<EditIcon />}>
                                                                Edit
                                                            </Button>
                                                            <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                                                                Delete
                                                            </Button>
                                                        </Stack>
                                                    </Hidden>

                                                    <Hidden smUp>
                                                        <Stack direction="row" spacing={1}>
                                                            <IconButton color="warning" aria-label="delete">
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton color="error" aria-label="add an alarm">
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            {/* <IconButton aria-label="delete" disabled color="error">
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            <IconButton color="primary" aria-label="add to shopping cart">
                                                                <AddShoppingCartIcon />
                                                            </IconButton> */}
                                                        </Stack>
                                                    </Hidden>
                                                </TableCell>
                                                {/* <TableCell align="right">{row.protein}</TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            : null
                    }

                    {/* <MUIDataTable

                        title={`Devices`}
                        data={facilities}
                        columns={columns}
                        options={options}
                    /> */}
                    {/* <TestReport params={reportProp}></TestReport> */}
                </Paper>
            </div>
        </div>
    );
}

export default DeviceList;