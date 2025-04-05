export interface IResponseData<T> {
    code: number
    message: string
    data: T
}

export interface IResponseDataWithPage<T> {
    data: T
    total: number
    page_no: number
    page_size: number
}
