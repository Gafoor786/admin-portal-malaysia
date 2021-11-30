import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
// import { createTheme, ThemeProvider } from '@mui/icons-material/styles';
import { StorageKeys, Theme } from '@data/constants'
import { Get, Save } from "@utilities/storage";
import { IAppSettings, InitialAppSettings } from '@interfaces/iApp';
import Loading from "@components/Loading";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
// import { Button, Snackbar } from "@mui/icons-material";
// import Alert from '@material-ui/lab/Alert';
import CustomizedSnackbars, { AlertMsgProps, AlertMsgTypes } from "@components/custom-snack-bar";


import login_de from "@translations/de/login.json";
import login_en from "@translations/en/login.json";

i18next.init({
  interpolation: { escapeValue: false },  // React already does escaping
  lng: 'en',                              // language to use
  resources: {
    en: {
      common: { ...login_en }               // 'common' is our custom namespace
    },
    de: {
      common: { ...login_de }
    },
  },
});


export const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;




export interface AppContextType {
  loading: boolean;
  theme: Theme,
  darkMode: boolean,
  // alertMessage: AlertMsgProps | null,
  setLoading: (status: boolean) => void;
  setTheme: (theme: Theme) => void;
  setDarkMode: (status: boolean) => void;
  // setAlertMessage: (msgs: AlertMsgProps) => void;
}



const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppContextProvider({ children, }: {
  children: ReactNode;
}): JSX.Element {
  const temp = Get<IAppSettings>(StorageKeys.APP_SETTINGS);
  const persistedState = temp ? temp : {};
  const InitialState: IAppSettings = {
    ...InitialAppSettings,
    ...persistedState
  };
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  if (InitialState.theme === Theme.Auto) {
    if (prefersDarkMode) {
      InitialState.isDarkTheme = true
    } else {
      InitialState.isDarkTheme = false
    }
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(InitialState.theme);
  const [darkMode, setDarkMode] = useState<boolean>(InitialState.isDarkTheme);
  const [alertMessage, setAlertMessage] = useState<AlertMsgProps>({ msgType: AlertMsgTypes.Sucess, msgs: [] });
  // const [keyId, setKeyId] = useState('');

  // useEffect(() => {

  //   setKeyId((Math.floor(Math.random() * 1000) + 1).toString())
  // }, [alertMessage]);

  useEffect(() => {
    const saveData: IAppSettings = {
      ...InitialState,
      theme: theme,
      isDarkTheme: darkMode
    }
    Save(StorageKeys.APP_SETTINGS, saveData)
  }, [theme, loading, darkMode]);




  // Make the provider update only when it should
  const memoedValue = useMemo(
    () => ({
      loading,
      theme,
      darkMode,
      // alertMessage,
      setLoading,
      setTheme,
      setDarkMode,
      // setAlertMessage
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, loading, darkMode, alertMessage]
  );



  return (
    <I18nextProvider i18n={i18next}>


      <AppContext.Provider value={memoedValue as AppContextType}>
        <CustomizedSnackbars params={alertMessage} />
        <Loading

          isOpen={loading}
          message={'Loading...'}
        //duration={5000}
        />
        {children}
      </AppContext.Provider>
    </I18nextProvider>
  );
}



// export function CustomSneakBar(props: { msgType: AlertMsgTypes, msgs: string[] }) {
//   const [open, setOpen] = React.useState(props && props.msgs && props.msgs.length > 0 ? true : false);


//   const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setOpen(false);
//   };

//   return (
//     <>
//       <Snackbar
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//         open={open}
//         autoHideDuration={3000}
//         onClose={handleClose}
//         message={props.msgs[0]}
//         action={
//           <React.Fragment>
//             <Button color="secondary" size="small" onClick={handleClose}>
//               UNDO
//             </Button>

//           </React.Fragment>
//         }
//       >
//       </Snackbar>
//     </>
//   );
// }

export default function useApp(): AppContextType {
  return useContext(AppContext);
}

