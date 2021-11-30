import React, { lazy, ReactPropTypes } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { RouterLinks } from "@routes/route-uls";
import { AsyncRoute } from '@utilities/AppRouter';

const Vendors = (props: ReactPropTypes) => {
    return (
        <div>
            {/* <h3>Vendor View</h3>
            <p> This is the home view of SPA</p>
            <ul>
                <li>
                    <Link to={RouterLinks.vendor.ADD}>Add Vendor</Link>
                </li>
                <li>
                    <Link to={RouterLinks.vendor.LIST}>List Vendor</Link>
                </li>
            </ul> */}

            <Switch>
                <AsyncRoute path={RouterLinks.vendor.ADD} importPath={import('./add-vendor')} />
                <AsyncRoute path={RouterLinks.vendor.LIST} importPath={import('./list-vendor')} />
                <Route exact path={RouterLinks.vendor.INDEX}>
                    <Redirect to={RouterLinks.vendor.ADD} />
                </Route>
            </Switch>
        </div>
    );
};

export default Vendors;