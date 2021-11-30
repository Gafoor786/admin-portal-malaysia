import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useEffect } from 'react';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export enum AlertMsgTypes {
    Sucess = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info'
}

export interface AlertMsgProps {
    msgType: AlertMsgTypes,
    msgs: string[]
}


const CustomizedSnackbars: React.FC<{ params: AlertMsgProps }> = ({ params }) => {
    const [open, setOpen] = React.useState(false);
    const [keyId, setKeyId] = React.useState('');
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {

        // window.localStorage["persistedState"] = JSON.stringify(fullInitialState);
        if (params && params?.msgs.length > 0) {
            setOpen(true)
            setKeyId((Math.floor(Math.random() * 1000) + 1).toString())
            setTimeout(() => {
                setOpen(false)
                setKeyId((Math.floor(Math.random() * 1000) + 1).toString())
                params.msgs = [];
            }, 4000);
        }
        else {
            setOpen(false)
        }
    }, [params]);

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>

            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={params?.msgType} sx={{ width: '100%' }}>
                    {
                        params.msgs.map((val, index) => {
                            return <React.Fragment key={`span-${keyId}-${index}`}>
                                <span >{val} </span> <br />
                            </React.Fragment >
                        })
                    }
                </Alert>
            </Snackbar>

        </Stack>
    );
}

export default CustomizedSnackbars;