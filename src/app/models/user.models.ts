export interface ServerRefreshTokenInterface {
    id: string
    ip: string
    userAgent: string
    date: Date
}

export interface ServerUserInterface {
    id: number;
    email: string;
    verified: boolean;
    refreshTokens: ServerRefreshTokenInterface[];
}