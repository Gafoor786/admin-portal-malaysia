
import { IFacility } from "@apiModels/facilities";
import { ApiBaseResponse } from "./base";




export interface FacilityListResponse extends ApiBaseResponse<IFacility[]> {
}

export interface FacilityResponse extends ApiBaseResponse<IFacility> {
}