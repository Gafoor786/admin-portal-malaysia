import { IUserType } from "@data/constants";
import { ApiBaseResponse } from "./base";



export interface Success {
    Code: string,
    Message: string,
}

export interface SuccessResponse extends ApiBaseResponse<Success> {

}

