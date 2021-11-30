import { ApiBaseResponse } from "./base";

export interface DeviceParams {
    deviceId: string;
    token: string;
    env: string;
}


export interface DeviceSuccessResponse extends ApiBaseResponse<DeviceParams> {

}