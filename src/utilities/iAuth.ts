import { IUserType } from "@data/constants";

export interface AuthState {
    user: User | null;
    loading: boolean;
    status: Status;
    authenticated: boolean;
}

export enum Status {
    NotLoggedIn = 'Not LoggedIn',
    InProgress = 'In Progress',
    LoggedIn = 'Logged In',
    LoggedOut = 'Logged Out',
}

export interface User {
    token: string;
    userType: IUserType;
    firstName: string;
    lastName: string;
    companyLogo: string;
}

export const initialAuthState: AuthState = {
    user: null,
    loading: false,
    status: Status.NotLoggedIn,
    authenticated: false,
};
