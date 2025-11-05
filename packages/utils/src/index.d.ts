export declare const validateEmail: (email: string) => boolean;
export declare const sanitizeInput: (input: string) => string;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const verifyPassword: (password: string, hash: string) => Promise<boolean>;
export declare const generateRandomString: (length: number) => string;
export declare const isValidUrl: (url: string) => boolean;
export declare const delay: (ms: number) => Promise<void>;
//# sourceMappingURL=index.d.ts.map