import {MESSAGE_CONTENT} from "../enum/Notification.ts";

export const getErrorMessage = (error: any): string =>
    error?.response?.data?.error_description ??
    error?.response?.data?.message ??
    error?.response?.data?.msg ??
    MESSAGE_CONTENT.DEFAULT_ERROR