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

// These codes must be manually copied from the server API spec and kept up to date
// If client/server are part of a monorepo, this could be moved to a shared module 
export const serverErrors = {
    'SERVER_ERROR': 'Internal Server Error',
    'INVALID_LOGIN': 'Email or password is invalid',
    'INVALID_ACCESS_TOKEN': 'You have been logged out',
    'INVALID_REFRESH_TOKEN': 'You have been logged out',
    'INVALID_TOKEN': 'Token is invalid',
    'USER_NOT_FOUND': 'Specified user was not found',
    'ITEM_NOT_FOUND': 'Specified item was not found',
    'WRONG_PASSWORD': 'Password is incorrect',
    'INVALID_PASSWORD': 'Password does not fulfill requirements',
    'ALREADY_VERIFIED': 'You are already verified',
    'NOT_VERIFIED': 'You must verify your email first',
    'EMAIL_IN_USE': 'That email is already in use',
    'EMAIL_ALREADY_SET': 'That is your current email',
    'VALIDATION_ERROR': 'Error validating input'
}
export type ServerErrorCodes = keyof typeof serverErrors

export interface ServerErrorInterface {
    code: ServerErrorCodes
    message: string
}

export const isServerError = (err: any): err is ServerErrorInterface => {
    if (typeof err !== 'object') return false
    const keys = Object.keys(err)
    if (!(
        keys.includes('code') && (
            (keys.includes('message') && keys.length === 2) || (!keys.includes('message') && keys.length === 1)
        )
    )) return false
    if (!(
        typeof err['code'] === 'string' &&
        (typeof err['message'] === 'string' || typeof err['details'] === 'undefined')
    )) return false
    return true
}