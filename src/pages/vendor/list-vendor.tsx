// import { DataGrid, GridCellValue, GridColDef, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Link as RouteLink } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import {
    Button, Grid, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Pagination
}
    from '@mui/material';
import { post } from '@helpers/axiosInstance';
import { HttpUrls } from '@utilities/apis';
import { RouterLinks } from '@routes/route-uls';
import { useAuthContext } from '@utilities/State';
import moment from 'moment';
import { VendorListResponse } from '@interfaces/api-responses/vendors';


import { styled } from '@mui/material/styles';
import { IVendor } from 'apiModels/models/vendors';



const StyledButtonBase = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    textDecoration: 'none'
}));

const StyledRouteLink = styled(RouteLink)(({ theme }) => ({
    textDecoration: 'none'
}));


// const styles = withStyles(({ palette, spacing }: { palette: Palette; spacing: Spacing }) => ({
//     root: {
//         display: 'flex',
//         flexDirection: 'column',
//         padding: spacing,
//         backgroundColor: palette.background.default,
//         color: palette.primary.main,
//     },
// }));


function VendorList() {
    const [page, setPage] = useState(1);
    const { state } = useAuthContext();
    const history = useHistory();
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);



    const formatDate = (val: Date) => {
        return moment(val).format('DD-MMM-yyyy');
    }

    const loadMore = (e: any) => {
        console.log(e)
    }

    useEffect(() => {

        const pg = {
            pageSize: 10,
            currentPage: page
        }
        post(history, HttpUrls.VENDOR_LIST, pg)
            .then((res: AxiosResponse<VendorListResponse>) => {
                setVendors(res.data?.Data.map(obj => ({ ...obj, id: obj.vendorId })))
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

                <StyledRouteLink to={RouterLinks.vendor.ADD}>
                    <StyledButtonBase variant="contained" color="primary" >
                        Add Vendor
                    </StyledButtonBase>
                </StyledRouteLink>

            </Grid>
            {/* <button onClick={loadMoreCommit}>Load More Commits</button> */}


            <div>
                {/* <DataGrid
                    rows={vendors}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    // checkboxSelection
                    disableSelectionOnClick
                /> */}

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Company Name</TableCell>
                                <TableCell align="right">Address</TableCell>
                                <TableCell align="right">Domain Id</TableCell>
                                <TableCell align="right">Vendor Type</TableCell>
                                <TableCell align="right">Date&nbsp;(Utc)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vendors.map((row, index) => (
                                <TableRow key={index.toString()}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.name}</TableCell>
                                    <TableCell align="right">{row.domainId}</TableCell>
                                    <TableCell align="right"> {Number(row.isSubVendor) === 0 ? 'Venodor' : 'Sub Vendor'}</TableCell>
                                    <TableCell align="right">{formatDate(row.createdOn)}</TableCell>
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
                            <Pagination count={10} page={page} onChange={loadMore} />
                        </Grid>
                    </Grid>
                </TableContainer>

                {/* <Pagination count={10} page={page} onChange={handleChange} /> */}

            </div>
        </div>
    );
}

export default VendorList;