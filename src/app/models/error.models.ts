export interface AppErrorInterface {
    message: string;
    actionable: boolean;
};

export class AppError implements AppErrorInterface {
    constructor(actionable: boolean = false, message: string = 'Unknown Error') {
        this.message = message
        this.actionable = actionable
    }
    message: string;
    actionable: boolean;
}

export type ServerErrorCodes = 'SERVER_ERROR' | 'INVALID_LOGIN' | 'INVALID_ACCESS_TOKEN' | 'INVALID_REFRESH_TOKEN' | 'INVALID_TOKEN' | 'USER_NOT_FOUND' | 'ITEM_NOT_FOUND' | 'WRONG_PASSWORD' | 'INVALID_PASSWORD' | 'ALREADY_VERIFIED' | 'NOT_VERIFIED' | 'EMAIL_IN_USE' | 'EMAIL_ALREADY_SET' | 'VALIDATION_ERROR'

export interface ServerErrorInterface {
    code: ServerErrorCodes
    message: string
    details: string
}

export const isServerError = (err: any): err is ServerErrorInterface => {
    if (typeof err !== 'object') return false
    const keys = Object.keys(err)
    if (!(
        (keys.includes('code') && keys.includes('message') && keys.length === 2) ||
        (keys.includes('code') && keys.includes('message') && keys.includes('details') && keys.length === 3)
    )) return false
    if (!(
        typeof err['code'] === 'string' &&
        typeof err['message'] === 'string' &&
        (typeof err['details'] === 'string' || typeof err['details'] === 'undefined')
    )) return false
    return true
}