import React from 'react'

import List from '@mui/material/List'

import IconDashboard from '@mui/icons-material/Dashboard'
import Person from '@mui/icons-material/Person'
import GroupAdd from '@mui/icons-material/GroupAdd'
import IconBarChart from '@mui/icons-material/BarChart'
import PersonAdd from '@mui/icons-material/PersonAdd'
import ApartmentIcon from '@mui/icons-material/Apartment';

import { createStyles, makeStyles } from '@mui/styles';

import AppMenuItem from './AppMenuItem'
import { RouterLinks } from '@routes/route-uls'
import { IUserType } from '@data/constants'
import { useAuthContext } from '@utilities/State'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { SvgIconTypeMap } from '@mui/material'

interface MenuItem {
    name: string;
    link: string;
    permissions: IUserType[];
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string; };
}

const appMenuItems: MenuItem[] = [
    {
        name: 'Dashboard',
        link: '/',
        Icon: IconDashboard,
        permissions: [IUserType.Admin, IUserType.SuperAdmin]
    },
    {
        name: 'Vendors',
        link: `${RouterLinks.vendor.INDEX}`,
        Icon: GroupAdd,
        permissions: [IUserType.SuperAdmin]
    },
    {
        name: 'Admins',
        link: `${RouterLinks.admin.INDEX}`,
        Icon: PersonAdd,
        permissions: [IUserType.Admin, IUserType.SuperAdmin]
    },
    {
        name: 'User',
        link: `${RouterLinks.user.INDEX}`,
        Icon: Person,
        permissions: [IUserType.Admin, IUserType.SuperAdmin]
    },
    {
        name: 'Facilities',
        link: `${RouterLinks.facilities.INDEX}`,
        Icon: ApartmentIcon,
        permissions: [IUserType.Admin, IUserType.SuperAdmin]
    },
    {
        name: 'Devices',
        link: `${RouterLinks.device.INDEX}`,
        Icon: IconBarChart,
        permissions: [IUserType.Admin]
    },
    // {
    //     name: 'Admin',
    //     Icon: IconLibraryBooks,
    //     items: [
    //         {
    //             name: 'Add ',
    //             link: `${RouterLinks.admin.ADD}`,
    //         },
    //         {
    //             name: 'Level 2',
    //             items: [
    //                 {
    //                     name: 'Level 3',
    //                 },
    //                 {
    //                     name: 'Level 3',
    //                 },
    //             ],
    //         },
    //     ],
    // },
]

const AppMenu: React.FC = () => {
    const classes = useStyles()
    const { state } = useAuthContext();
    const userType = state.user?.userType;
    const filterMenu: MenuItem[] = [];
    if (userType) {
        appMenuItems.forEach(v => {
            if (Object.values(v.permissions).includes(userType)) {
                filterMenu.push(v);
            }
        })
    }
    console.log()
    return (
        <List component="nav" className={classes.appMenu} disablePadding>
            {/* <AppMenuItem {...appMenuItems[0]} /> */}
            {filterMenu.map((item, index) => (
                <AppMenuItem {...item} key={index} />
            ))}
        </List>
    )
}

const useStyles = makeStyles(theme =>
    createStyles({
        appMenu: {
            width: '100%',
        },

    }),
)

export default AppMenu
