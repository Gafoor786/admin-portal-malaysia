import { IBase } from "./base";

export interface IFacility extends IBase {
    facilityId: string;
    name: string;
    address: string;
    vendorId: string;
    isDeleted: boolean;

}