import { IVendor } from "apiModels/models/vendors";
import { ApiBaseResponse } from "./base";




export interface VendorListResponse extends ApiBaseResponse<IVendor[]> {
}

export interface VendorResponse extends ApiBaseResponse<IVendor> {
}