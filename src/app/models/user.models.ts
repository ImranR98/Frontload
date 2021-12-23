export interface ServerRefreshTokenInterface {
    _id: string
    ip: string
    userAgent: string
    date: Date
}

export interface ServerUserInterface {
    _id: number;
    email: string;
    verified: boolean;
    refreshTokens: ServerRefreshTokenInterface[];
}