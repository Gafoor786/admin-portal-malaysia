import { User } from './iAuth';

export enum ActionType {
    LoginProgress,
    LoggedIn,
    LoggedOut,
    LoginError,
}

export interface UserLoggedIn {
    type: ActionType.LoggedIn;
    payload: User;
}

export interface UserLoginProgress {
    type: ActionType.LoginProgress;
    payload: { time: number; status: boolean };
}

export interface UserLoggedOut {
    type: ActionType.LoggedOut;
}

export interface UserLoginError {
    type: ActionType.LoginError;
    payload: string[]
}

export type UserActions = UserLoggedIn | UserLoginProgress | UserLoggedOut | UserLoginError;
