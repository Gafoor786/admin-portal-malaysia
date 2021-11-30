import React, { createContext, useContext, useEffect, useReducer } from "react";
import reducer, { initialState } from "./reducer";
import logger from "./logger";
import { Get, Save } from '@utilities/storage';
import { AuthState } from "./iAuth";
import { StorageKeys } from "@data/constants";
import { UserActions } from "./actions";

let AppAuthContext = createContext(initialState as any);

const loggerReducer = logger(reducer);

function AppAuthContextProvider(props: any) {

    const temp = Get<AuthState>(StorageKeys.PERSISTED_STATE);
    const persistedState = temp ? temp : {};


    const fullInitialState: AuthState = {
        ...initialState,
        ...persistedState
    };

    let [state, dispatch] = useReducer(loggerReducer, fullInitialState) as unknown as [state: AuthState, dispatch: React.Dispatch<UserActions>];
    let value = { state, dispatch };

    useEffect(() => {
        // window.localStorage["persistedState"] = JSON.stringify(fullInitialState);
        Save(StorageKeys.PERSISTED_STATE, {
            ...fullInitialState,
            ...state
        });
    }, [state]);

    return (
        <AppAuthContext.Provider value={value}>{props.children}</AppAuthContext.Provider>
    );
}

let AppContextConsumer = AppAuthContext.Consumer;

// eslint-disable-next-line react-hooks/rules-of-hooks
const useAuthContext = () => useContext(AppAuthContext) as unknown as { state: AuthState, dispatch: React.Dispatch<UserActions> };

export { AppAuthContext, AppAuthContextProvider, AppContextConsumer, useAuthContext };
