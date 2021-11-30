import { IBase } from "./base";


export interface IVendor extends IBase {
    vendorId: string;
    name: string;
    address: string;
    isDeleted: boolean;
    domainId: string;
    logoPath: string;
    email: string;
    contact: string;
    // roles: IRoles[];
    // permissions: IPermissions[];
    isSubVendor: boolean;
}

export interface ISubVendor extends IVendor {
    parentVendorId: string;
}


