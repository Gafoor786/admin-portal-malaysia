import { ReactPropTypes } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouterLinks } from "@routes/route-uls";
import { AsyncRoute } from '@utilities/AppRouter';


const Admin = (props: ReactPropTypes) => {

    return (
        <div>
            {/* <h3>Dashboard View</h3>
            <p> This is the home view of SPA</p>
            <ul>
                <li>
                    <Link to={RouterLinks.admin.ADD}>
                        <Button>
                            <span>Add Admin</span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Link to={RouterLinks.admin.LIST}>List Admin</Link>
                </li>
            </ul>
            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Link to={RouterLinks.admin.ADD}>
                    <Button variant="contained" color="primary" className={classes.btn} >
                        Click Add!
                    </Button>
                </Link>

                <Link to={RouterLinks.admin.LIST}>
                    <Button >
                        Click List!
                    </Button>
                </Link>

            </Grid> */}
            <Switch>
                <AsyncRoute path={RouterLinks.facilities.ADD} importPath={import('./add-facility')} />
                <AsyncRoute path={RouterLinks.facilities.LIST} importPath={import('./list-facility')} />
                <AsyncRoute path={RouterLinks.facilities.EDIT} importPath={import('./edit-facility')} />
                <Route exact path={RouterLinks.facilities.INDEX}>
                    <Redirect to={RouterLinks.facilities.ADD} />
                </Route>
            </Switch>
        </div>
    );
};

export default Admin;