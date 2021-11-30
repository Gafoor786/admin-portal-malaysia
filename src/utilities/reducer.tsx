
// import { post } from "@helpers/axiosInstance";
// import { LoginRequest } from "@interfaces/login";
import { StorageKeys } from "@data/constants";
import { ActionType, UserActions } from "./actions";

import { AuthState, initialAuthState } from "./iAuth";
import { Delete } from "./storage";


export const initialState = { ...initialAuthState }

const reducer = (state: AuthState, action: UserActions): AuthState => {
    switch (action.type) {
        case ActionType.LoginProgress: {
            return { ...state, loading: action.payload.status };
        }
        case ActionType.LoggedIn: {
            return { ...state, loading: false, user: action.payload, authenticated: true };
        }
        case ActionType.LoggedOut: {
            Delete(StorageKeys.TOKEN)
            return { ...state, loading: false, user: null, authenticated: false };
        }
        case ActionType.LoginError: {
            return { ...state, loading: false };
        }
        default: {
            return state;
        }
    }

};



export const logout = async (dispatch: React.Dispatch<UserActions>): Promise<boolean> => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            dispatch({ type: ActionType.LoggedOut })
            resolve(true);
        }, 2000);
    });
};

// export const resetGame = (): ResetGame => ({
//   type: ActionType.ResetGame,
// });

function validateEmail(email: string) {
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}
export default reducer;
