import { IBase } from "@apiModels/base";
import { ApiBaseResponse } from "./base";


export interface IDevice extends IBase {
    deviceId: string;
    vendorId: string;
    imagePath: string;
    isDeleted: boolean;
    name: string;
    facilityId: string;
    templateId: number;
    description: string;
}

export interface IDeviceListResponse extends ApiBaseResponse<IDevice[]> {
}