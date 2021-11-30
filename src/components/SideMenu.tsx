import React, { Suspense, useEffect } from 'react';
import {
    AppBar, Drawer, Divider,
    Hidden, IconButton, Toolbar, Typography, Badge,
    MenuItem, Menu
} from '@mui/material';

import { createStyles, makeStyles } from '@mui/styles';
import { createTheme, Palette, Theme, ThemeProvider, useTheme, withStyles } from '@mui/material/styles';
import { Spacing } from '@mui/system';

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';

import { useAuthContext } from '@utilities/State';
import { logout } from '@utilities/reducer';
import { useHistory } from 'react-router';
import useApp from '@hooks/useApp';
import AppMenu from '@components/side-nav-bar/AppMenu';
import { AppRoutes } from '@utilities/AppRouter';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        grow: {
            flexGrow: 1,
        },
        drawer: {
            // [theme.breakpoints.up('md')]: {
            //     width: drawerWidth,
            //     flexShrink: 0,
            // },
        },
        appBar: {
            // [theme.breakpoints.up('md')]: {
            //     width: `calc(100% - ${0}px)`,
            //     marginLeft: 0,
            // },
            // color: theme.mixins.toolbar,
        },
        menuButton: {
            marginRight: theme.spacing(2),
            // [theme.breakpoints.up('md')]: {
            //     display: 'none',
            // },
        },
        // necessary for content to be below app bar
        // toolbar: { ...theme.mixins.toolbar}, // deprecated
        drawerPaper: {
            width: drawerWidth,
            marginTop: 65
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        sectionDesktop: {
            display: 'none',
            // [theme.breakpoints.up('sm')]: {
            //     display: 'flex',
            // },
        },
        sectionMobile: {
            display: 'flex',
            // [theme.breakpoints.up('sm')]: {
            //     display: 'none',
            // },
        },
        title: {
            display: 'none',
            // [theme.breakpoints.up('sm')]: {
            //     display: 'block',
            // },
        },
    }),
);

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

const SideMenu: React.FC<Props> = (props: Props) => {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const { setLoading } = useApp();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
    const { state, dispatch } = useAuthContext();
    const history = useHistory();

    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const isMenuOpen = Boolean(anchorEl);
    // const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const handleMenuClose = () => {
        setAnchorEl(null);
        // handleMobileMenuClose();
    };
    const logOut = async () => {
        handleMenuClose();
        setLoading(true);
        //dispatch({ type: ActionType.LoggedOut })
        await logout(dispatch)

        setLoading(false);
        // history.replace(RouterLinks.LOGIN)
    }
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={logOut}>Logout</MenuItem>
        </Menu>
    );


    useEffect(() => {


        return () => {
        };
    }, [
        state,

    ]);

    const drawer = (
        <div>
            <div />
            <Divider />
            <AppMenu />
            {/* <List>
                {[...ROUTE_URLS].map((val, index) => (
                    <ListItem button key={index.toString()}>
                        <ListItemIcon><MasterIcons.EmailOutlined /></ListItemIcon>
                        <ListItemText primary={val.name} />
                    </ListItem>
                ))}
            </List> */}
            <Divider />
            {/* <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List> */}
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>


            <main className={classes.content}>
                {
                    state?.authenticated ?
                        <div /> : null
                }

            </main>
            {/* {renderMobileMenu} */}
            {renderMenu}
        </div>

    );
}

export default SideMenu;