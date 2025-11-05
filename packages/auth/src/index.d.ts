import { IUser } from '@ai-job-applier/types';
export interface ITokenPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}
export declare class AuthService {
    private jwtSecret;
    constructor();
    generateToken(user: IUser): string;
    verifyToken(token: string): ITokenPayload | null;
    getUserIdFromToken(token: string): string | null;
}
//# sourceMappingURL=index.d.ts.map