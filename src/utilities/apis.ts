
export enum StatusCodes {
    Created = 201,
    Success = 200,
    Forbidden = 403,
    InternalServerError = 500,
    UnAuthorized = 401,
    BadRequest = 400
}


export interface SuccessMessage {
    Code: string;
    Message: string;
}
export interface SuccessResponse {
    Code?: string;
    Data: object;
    Message?: string;
}

export interface ErrorResponse {
    ErrorCode: string;
    ErrorMessage: string;
    ErrorData?: Object;
}

export interface AuthErrorResponse extends ErrorResponse {
}

export interface InternalServerResponse extends ErrorResponse {
    ErrorData?: object;
}

export type GenericResponse = AuthErrorResponse | ErrorResponse[] | ErrorResponse | SuccessResponse | SuccessMessage | InternalServerResponse;


export interface ValidationResponse {
    valid: boolean;
    messages: ErrorResponse[];
}

const BASE_URL = `${process.env.REACT_APP_API_ENDPOINT}`

export const HttpUrls = {
    LOGIN: `${BASE_URL}/admin/auth`,
    SAMPLE_GET: `${BASE_URL}/sample`,
    SAMPLE_TOKEN_GET: `${BASE_URL}/tokenTest/test`,
    ADMIN_LIST: `${BASE_URL}/admin/user/getAll`,
    ADD_ADMIN: `${BASE_URL}/admin/user`,
    ADD_USER: `${BASE_URL}/user`,
    ADD_FACILITY: `${BASE_URL}/facility`,
    ADD_VENDOR: `${BASE_URL}/vendor`,
    ADD_DEVICE: `${BASE_URL}/device`,
    EDIT_DEVICE: `${BASE_URL}/device`,
    VENDOR_LIST: `${BASE_URL}/vendor/getAll`,
    VENDOR_LIST_ALL: `${BASE_URL}/vendor/getAll`,
    FACILITY_LIST_ALL: `${BASE_URL}/facility/getAll`,
    DEVICES_LIST_ALL: `${BASE_URL}/device/getAll`,
    DEVICES_BY_FACILITY_ID: `${BASE_URL}/facility/{facilityId}/devices`,
    GET_DEVICE_CONFIG_BY_ID: `${BASE_URL}/device/{deviceId}/config`,
    USER_LIST: `${BASE_URL}/user/getAll`,
    GET_FACILITY: `${BASE_URL}/facility/{facilityId}  `
};



