
export interface IBase {

    createdOn: Date;
    updatedOn: Date;
}


export enum ISearchEnum {
    Query,
    Scan
}

export interface IAddress {
    hNo: string;
    street1: string;
    street2?: string;
    street3?: string;
    state: string;
    country: string;
    pincode: number;
}

export interface IRoles {
    roleId: string;
    name: string;
    permissions: IPermissions[];
}
export interface IPermissions {
    permissionId: string;
    name: string;
}



export const hasDuplicates = (arr: Array<string>) => {
    return new Set(arr).size !== arr.length;
}
