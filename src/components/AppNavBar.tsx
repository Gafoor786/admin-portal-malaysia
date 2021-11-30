import * as React from 'react';
import { styled, alpha, } from '@mui/material/styles';
import {
    AppBar, Hidden, Box, Toolbar, IconButton, Typography,
    InputBase, MenuItem, Badge, Menu, Drawer, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert'
import { drawerWidth } from '@data/constants';
import AppMenu from '@components/side-nav-bar/AppMenu';
import useApp from '@hooks/useApp';
import { useAuthContext } from '@utilities/State';
import { logout } from '@utilities/reducer';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}


// const StyledDrawer = styled('div')(({ theme }) => ({
//     marginTop: `${Number(theme.mixins.toolbar.minHeight?.toString()) + 45}px`,
//     width: drawerWidth,
//     [theme.breakpoints.up('md')]: {
//         width: drawerWidth,
//         flexShrink: 0,
//     },
// }));


const StyledDrawerComp = styled(Drawer)(({ theme }) => ({

    width: drawerWidth,

}));


const StyledDrawer = styled('div')(({ theme }) => ({ /// For border right this component have to check
    paddingTop: `${Number(20)}px`,
    marginTop: `${Number(theme.mixins.toolbar.minHeight?.toString()) + 10}px`,
    width: drawerWidth,
    border: 0,
    [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
        // marginTop: `${Number(theme.mixins.toolbar.minHeight?.toString()) + 45}px`,
    },
    [theme.breakpoints.down('md')]: {
        marginTop: `${Number(theme.mixins.toolbar.minHeight?.toString()) + 10}px`,
    },
}));



const StyledIconButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
}));





const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


export default function PrimarySearchAppBar(props: Props) {
    const { window } = props;
    const { setLoading } = useApp();
    const { state, dispatch } = useAuthContext();
    // const classes = useStyles(theme);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const logOut = async () => {
        handleMenuClose();
        setLoading(true);
        //dispatch({ type: ActionType.LoggedOut })
        await logout(dispatch)

        setLoading(false);
        // history.replace(RouterLinks.LOGIN)
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Change Password</MenuItem>
            <MenuItem onClick={logOut}>LogOut</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
            <MenuItem onClick={logOut}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Change Password</p>
            </MenuItem>
            <MenuItem onClick={logOut}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>LogOut</p>
            </MenuItem>
        </Menu>
    );
    const drawer = (
        <StyledDrawer>


            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ margin: (theme) => theme.spacing(2, 0, 2, 0) }}
            >
                <img alt="Company logo" src={state.user?.companyLogo} style={{ width: '75%' }}

                />
            </Box>
            {/* <Divider /> */}
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
        </StyledDrawer>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    if (!state.authenticated) {
        return null
    } else {
        return (

            <>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar >
                        <StyledIconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        // className={clsx(newCCc.root)}
                        >
                            <MenuIcon />
                        </StyledIconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            Admin Portal
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={4} color="error">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                            >
                                <Badge badgeContent={17} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <nav
                    // className={classes.drawer} 
                    aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

                    <Hidden mdUp implementation="css">
                        <StyledDrawerComp
                            container={container}
                            variant="temporary"
                            anchor={'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            // classes={{
                            //     paper: classes.drawerPaper,
                            // }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </StyledDrawerComp>
                    </Hidden>
                    <Hidden mdDown implementation="css">
                        <StyledDrawerComp
                            classes={{
                                // paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </StyledDrawerComp>
                    </Hidden>
                </nav>
                {renderMobileMenu}
                {renderMenu}
            </>

        );
    }

}
