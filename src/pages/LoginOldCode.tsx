
import useApp from '@hooks/useApp';
import { LoginRequest } from '@interfaces/login';
import { Button, Card, CardActions, CardContent, Container, TextField } from '@mui/material';
import { ActionType } from '@utilities/actions';
import { User } from '@utilities/iAuth';
import { useAuthContext } from '@utilities/State';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ErrorResponse, HttpUrls } from '@utilities/apis';
import { post } from '@helpers/axiosInstance';
import { AlertMsgTypes } from '@components/custom-snack-bar';
import { RouterLinks } from '@routes/route-uls';

// New Code
import { createStyles, makeStyles } from '@mui/styles';
import { createTheme, Palette, Theme, ThemeProvider, withStyles } from '@mui/material/styles';
import { Spacing } from '@mui/system';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '100%',
            },
        },
    }),
);

const LoginOldCode: React.FC = () => {

    // const { name } = useParams<{ name: string; }>();
    // const { meterId } = useParams<{ meterId: string; }>();

    const history = useHistory();
    const [email, setEmail] = useState<string>("superadmin@vendor1.com.my");
    const [password, setPassword] = useState<string>("password@123");
    // const [iserror, setIserror] = useState<boolean>(false);
    // const [rememberMe, setRememberMe] = useState<boolean>(false);
    // const [message, setMessage] = useState<string>("");
    const { state, dispatch } = useAuthContext();
    const { setLoading } = useApp();

    useEffect(() => {
        if (state?.authenticated) {
            history?.replace(RouterLinks.DASHBOARD)
        }

        return () => {
        };
    }, [history, state]);

    const handleLogin = async () => {
        setLoading(true);

        dispatch({ type: ActionType.LoginProgress, payload: { time: Math.floor(Math.random() * 100), status: true } })
        const loginData: LoginRequest = {
            emailId: email,
            password: password,
            rememberMe: false
        }
        //dispatch({ type: ActionType.LoginProgress, payload: true })
        dispatch({ type: ActionType.LoginProgress, payload: { time: Math.floor(Math.random() * 100), status: true } })

        await post(history, HttpUrls.LOGIN, loginData)
            .then(res => {

                dispatch({ type: ActionType.LoggedIn, payload: res.data as User })
                setLoading(false);
            })
            .catch((error) => {

                const res = error.data as ErrorResponse;
                // setAlertMessage({ msgType: AlertMsgTypes.Error, msgs: [res.ErrorMessage] })
                setLoading(false);
                // setMessage("Auth failure! Please create an account");
                // setIserror(true)
            })
        // const success = await login(history, dispatch, data);
        // if (success) {
        //     dispatch({ type: ActionType.LoggedIn, payload: { id: 1, name: 'Deepu', status: Status.LoggedIn, value: 2 } })
        //     history.replace(RouterLinks.DASHBOARD)
        // } else {
        //     dispatch({ type: ActionType.LoginError, payload: ['Login error'] })
        // }
        // dispatch({ type: ActionType.LoggedIn, payload: { id: 1, name: 'Deepu', status: Status.LoggedIn, value: 2 } })
        // history.replace(RouterLinks.DASHBOARD)
        // //dispatch({ type: ActionType.LoggedIn, loader: false })
        // setLoading(false);
    };


    const classes = useStyles();
    return (
        <div>
            <Container maxWidth="sm">

                <Card className={classes.root}>
                    <CardContent>
                        <form className={classes.root} noValidate autoComplete="off">
                            <div>
                                <TextField required id="standard-required" label="Email Id" defaultValue="superadmin@vendor1.com.my" />
                                <br />
                                {/* <TextField disabled id="standard-disabled" label="Disabled" defaultValue="Hello World" /> */}
                                <TextField
                                    id="standard-password-input"
                                    error={true}
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    defaultValue="password@123"
                                />

                                {/* <TextField
                                    helperText={this.state.helperText}
                                    onChange={this.onChange.bind(this)}
                                    error={this.state.error}
                                    required
                                    id="outlined-required"
                                    label="First Name"
                                /> */}

                            </div>
                        </form>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>

                <Button variant="contained" onClick={handleLogin} >
                    Login
                </Button>
            </Container>

        </div>
    );
};

export default LoginOldCode;
