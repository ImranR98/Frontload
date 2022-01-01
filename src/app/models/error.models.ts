export interface AppErrorInterface {
    message: string;
    actionable: boolean;
};

export class AppError implements AppErrorInterface {
    constructor(actionable: boolean = false, message: string = $localize `Unknown Error`) {
        this.message = message
        this.actionable = actionable
    }
    message: string;
    actionable: boolean;
}

// These codes must be manually copied from the server API spec and kept up to date
// If client/server are part of a monorepo, this could be moved to a shared module 
export const serverErrors = {
    'SERVER_ERROR': $localize`Internal Server Error`,
    'INVALID_LOGIN': $localize`Email or password is invalid`,
    'INVALID_ACCESS_TOKEN': $localize`You have been logged out`,
    'INVALID_REFRESH_TOKEN': $localize`You have been logged out`,
    'INVALID_TOKEN': $localize`Token is invalid`,
    'USER_NOT_FOUND': $localize`Specified user was not found`,
    'ITEM_NOT_FOUND': $localize`Specified item was not found`,
    'WRONG_PASSWORD': $localize`Password is incorrect`,
    'INVALID_PASSWORD': $localize`Password does not fulfill requirements`,
    'ALREADY_VERIFIED': $localize`You are already verified`,
    'NOT_VERIFIED': $localize`You must verify your email first`,
    'EMAIL_IN_USE': $localize`That email is already in use`,
    'EMAIL_ALREADY_SET': $localize`That is your current email`,
    'VALIDATION_ERROR': $localize`Error validating input`
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