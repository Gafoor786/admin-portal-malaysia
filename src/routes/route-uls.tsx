
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { SvgIconTypeMap } from '@mui/material';


export const RouterLinks = {
    DEFAULT: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    FORGOT_PASSWORD: '/forgot-password',
    NOTFOUND: '/not-found',
    admin: {
        INDEX: '/admin',
        ADD: '/admin/add',
        LIST: '/admin/list'
    },
    user: {
        INDEX: '/user',
        ADD: '/user/add',
        LIST: '/user/list'
    },
    facilities: {
        INDEX: '/facilities',
        ADD: '/facilities/add',
        LIST: '/facilities/list',
        EDIT: '/facilities/edit/:facilityId',
    },
    vendor: {
        INDEX: '/vendor',
        ADD: '/vendor/add',
        LIST: '/vendor/list'
    },
    device: {
        INDEX: '/device',
        ADD: '/device/add',
        EDIT: '/device/edit/:deviceId',
        LIST: '/device/list'
    }
}

export const ROUTE_URLS: RouteUrls[] = [
    {
        icon: `${AccountCircle.name}`,
        name: 'Dashboard',
        urlPath: RouterLinks.DASHBOARD,
        access: true,
    },
    {
        icon: `${AccountCircle.name}`,
        name: 'Admins',
        urlPath: RouterLinks.admin.INDEX,
        access: true,
        childrens: [
            {
                icon: `${SearchIcon.name}`,
                name: 'Add Admins',
                urlPath: `${RouterLinks.admin.INDEX}`,
                access: true,
            }
        ]
    },
    {
        icon: `${AccountCircle.name}`,
        name: 'Users',
        urlPath: RouterLinks.admin.INDEX,
        access: true,
        childrens: [
            {
                icon: `${SearchIcon.name}`,
                name: 'Add Users',
                urlPath: `${RouterLinks.admin.INDEX}`,
                access: true,
            }
        ]
    }
]



export interface RouteUrls {
    // icon?: string | OverridableComponent<SvgIconTypeMap>;
    icon: string;
    name: string;
    urlPath?: string;
    access: boolean
    childrens?: RouteUrls[]
}