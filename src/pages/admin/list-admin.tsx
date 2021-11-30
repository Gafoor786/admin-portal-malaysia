// import { DataGrid, GridCellValue, GridColDef, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Link as RouteLink } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { Button, Grid, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { post } from '@helpers/axiosInstance';
import { HttpUrls } from '@utilities/apis';
import { AdminUser, AdminUserResponse } from '@interfaces/api-responses/admin-user';
import { RouterLinks } from '@routes/route-uls';
import moment from 'moment';
import { styled } from '@mui/material/styles';

const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    textDecoration: 'none'
}));

const StyledRouteLink = styled(RouteLink)(() => ({
    textDecoration: 'none'
}));

function AdminList() {
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const history = useHistory();
    const [users, setUsers] = useState<AdminUser[]>([]);


    const formatDate = (val: Date) => {
        return moment(val).format('DD-MMM-yyyy');
    }

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {

        const pg = {
            pageSize: 10,
            currentPage: page
        }
        post(history, HttpUrls.ADMIN_LIST, pg)
            .then((res: AxiosResponse<AdminUserResponse>) => {
                if (page === 1) {
                    const rem = res.data.Data.totalCount % 10;
                    const newPage = (res.data.Data.totalCount - rem) / 10;
                    setTotalCount(rem > 0 ? newPage + 1 : newPage);
                }
                if (res.data?.Data?.result)
                    setUsers(res.data?.Data.result)
                else
                    setUsers([])
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
                <StyledRouteLink to={RouterLinks.admin.ADD}>
                    <StyledButtonBase variant="contained" color="primary" >
                        Add Admin
                    </StyledButtonBase>
                </StyledRouteLink>

            </Grid>
            {/* <button onClick={loadMoreCommit}>Load More Commits</button> */}


            <div style={{ width: '100%' }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Company Name</TableCell>
                                <TableCell align="right">Address</TableCell>
                                <TableCell align="right">Domain Id</TableCell>
                                <TableCell align="right">Date&nbsp;(Utc)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                users && users.length > 0 ?
                                    users.map((row, index) => (
                                        <TableRow key={index.toString()}>
                                            <TableCell component="th" scope="row">
                                                {row.firstName}
                                            </TableCell>
                                            <TableCell align="right">{row.lastName}</TableCell>
                                            <TableCell align="right">{row.emailId}</TableCell>

                                            <TableCell align="right">{formatDate(row.createdOn)}</TableCell>
                                        </TableRow>
                                    )) :
                                    <TableRow>
                                        <TableCell align="center">No records found</TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                    >
                        <Grid item >
                            <Pagination count={totalCount} page={page} onChange={handleChange} />
                        </Grid>
                    </Grid>
                </TableContainer>

            </div>
        </div>
    );
}

export default AdminList;