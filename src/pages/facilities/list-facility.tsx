// import { DataGrid, GridCellValue, GridColDef, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Link as RouteLink } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { Button, Grid, Hidden, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { post } from '@helpers/axiosInstance';
import { HttpUrls } from '@utilities/apis';
import { AdminUser, AdminUserResponse } from '@interfaces/api-responses/admin-user';
import { RouterLinks } from '@routes/route-uls';
import { useAuthContext } from '@utilities/State';
import { DeleteSharp, EditSharp } from '@mui/icons-material';
import moment from 'moment';
import { createStyles, makeStyles } from '@mui/styles';
import { createTheme, Palette, Theme, ThemeProvider, withStyles, styled } from '@mui/material/styles';
import { Spacing } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IFacility } from '@apiModels/facilities';
import { FacilityListResponse } from '@interfaces/api-responses/facility';



const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    textDecoration: 'none'
}));

const StyledRouteLink = styled(RouteLink)(() => ({
    textDecoration: 'none'
}));


function FacilityList() {
    const [page, setPage] = useState(1);
    const { state } = useAuthContext();
    const history = useHistory();
    const [facilities, setFacilities] = useState<IFacility[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    const formatDate = (val: Date) => {
        return moment(val).format('DD-MMM-yyyy');
    }

    const onEdit = (val: string) => {
        history.push(RouterLinks.facilities.EDIT.replace(':facilityId', val));
    }

    useEffect(() => {

        const pg = {
            pageSize: 10,
            currentPage: page
        }
        post(history, HttpUrls.FACILITY_LIST_ALL, pg)
            .then((res: AxiosResponse<FacilityListResponse>) => {

                setFacilities(res.data?.Data.map(obj => ({ ...obj, id: obj.facilityId })))
                // history?.replace(RouterLinks.DASHBOARD)
            })
            .catch(() => {

                // setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [res.ErrorMessage] })
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

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
                <StyledRouteLink to={RouterLinks.user.ADD}>
                    <StyledButtonBase variant="contained" color="primary" >
                        Add Facility
                    </StyledButtonBase>
                </StyledRouteLink>

            </Grid>
            {/* <button onClick={loadMoreCommit}>Load More Commits</button> */}


            <div style={{ width: '100%' }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Facility Name</TableCell>
                                <TableCell align="right">Address</TableCell>
                                <TableCell align="right"> Delete Status</TableCell>
                                <TableCell align="right">Date&nbsp;(Utc)</TableCell>
                                <TableCell align="right"> Action </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {facilities.map((row, index) => (
                                <TableRow key={index.toString()}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.address}</TableCell>
                                    <TableCell align="right">{row.isDeleted}</TableCell>
                                    {/* <TableCell align="right">{row.isSubVendor} {Number(row.isSubVendor) === 0 ? 'Venodor' : 'Sub Vendor'}</TableCell> */}
                                    <TableCell align="right">{formatDate(row.createdOn)}</TableCell>
                                    <TableCell align="right">
                                        <Hidden smDown>
                                            <Stack direction="row" spacing={2}>
                                                {/* <Button variant="contained" endIcon={<SendIcon />}>
                                                                Send
                                                            </Button> */}
                                                <Button variant="contained" color="warning" onClick={() => onEdit(row.facilityId)} startIcon={<EditIcon />}>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                    >
                        <Grid item >
                            <Pagination count={10} page={page} />
                        </Grid>
                    </Grid>

                </TableContainer>

            </div>
        </div>
    );
}

export default FacilityList;