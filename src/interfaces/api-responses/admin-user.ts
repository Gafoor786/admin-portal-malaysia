import { ApiBaseResponse, GetAll } from "./base";



export interface AdminUser {
    id: string;
    adminId: string;
    emailId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    createdOn: Date;
}


export interface AdminUserResponse extends ApiBaseResponse<GetAll<AdminUser[]>> {

}