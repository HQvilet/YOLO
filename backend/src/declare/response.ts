import type { Response } from "express";
import { error } from "node:console";

export interface ResponseMessage<T>{
    success: boolean,
    message?: string,
    error?: string,
    data?: T
}

export const serverResponseMessage = (
    message: ResponseMessage<any>,
    ): Object => {
    return message
}

export const serverErrorMessage = (errorMessage: string) => serverResponseMessage({
    success: false, 
    error: "Internal server error.",
    message: errorMessage,
})

