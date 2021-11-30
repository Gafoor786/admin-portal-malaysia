export interface ApiBaseResponse<T> {
    Code: string;
    Data: T
    Message: string;
}


export interface GetAll<T> {
    totalCount: number;
    result: T
}

export interface IBase {

    createdOn: Date;
    updatedOn: Date;
}