import React, { lazy } from "react";
import { Switch, Route, Redirect, RouteProps } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import { RouterLinks } from "@routes/route-uls";


export type AsyncRouteProps = RouteProps & { importPath: Promise<any> };

export const AsyncRoute = ({ importPath, ...props }: AsyncRouteProps) => {
  return <Route
    {...props}
    component={lazy(() => importPath)}
  />
}


export function AuthenticatedRoute(props: AsyncRouteProps) {
  const { state } = useAuth();

  if (!state.authenticated) return <Redirect to="/login" />;

  return <AsyncRoute {...props} />;
}



export const AppRoutes = () => {
  return (
    <Switch>
      <AsyncRoute path={RouterLinks.LOGIN} importPath={import('@pages/Login')} />
      <AsyncRoute path={RouterLinks.LOGINMUI} importPath={import('@pages/LoginMui')} />
      <AuthenticatedRoute path={RouterLinks.DASHBOARD} importPath={import('@pages/Dashboard')} />
      <AuthenticatedRoute path={RouterLinks.admin.INDEX} importPath={import('@pages/admin')} />
      <AuthenticatedRoute path={RouterLinks.user.INDEX} importPath={import('@pages/user')} />
      <AuthenticatedRoute path={RouterLinks.vendor.INDEX} importPath={import('@pages/vendor')} />
      <AuthenticatedRoute path={RouterLinks.device.INDEX} importPath={import('@pages/devices')} />
      <AuthenticatedRoute path={RouterLinks.facilities.INDEX} importPath={import('@pages/facilities')} />
      <Route exact path={RouterLinks.DEFAULT}>
        <Redirect to={RouterLinks.LOGIN} />
      </Route>
      <AsyncRoute path="*" importPath={import('@pages/NotFound')} />
    </Switch>
  );
};