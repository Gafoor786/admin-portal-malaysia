import { IUserType } from "@data/constants";
import { ApiBaseResponse } from "./base";



export interface Login {
    token: string;
    // loggedInUserId: string;
    userType: IUserType
    firstName: string;
    lastName: string;
}

export interface LoginResponse extends ApiBaseResponse<Login> {

}