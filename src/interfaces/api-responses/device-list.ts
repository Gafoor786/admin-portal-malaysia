import { ApiBaseResponse } from "./base";


export interface DeviceFacility {
    deviceName: string;
    facilityName: string;
    deviceId: string;
    vendorId: string;
    imagePath: string;
    isDeleted: boolean;
    name: string;
    facilityId: string;
    templateId: number;
    description: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface DeviceFacilityResponse extends ApiBaseResponse<DeviceFacility[]> {

}