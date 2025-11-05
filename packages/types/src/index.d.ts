export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    location?: string;
    experience?: number;
    skills?: string[];
    preferences?: {
        location?: string;
        remote?: boolean;
        jobTypes?: string[];
        salary?: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IJob {
    id?: string;
    title: string;
    company: string;
    location: string;
    description: string;
    postedDate: Date;
    url: string;
    source: string;
    remote?: boolean;
    salary?: string;
    jobType?: string;
    experienceLevel?: string;
    skills?: string[];
    benefits?: string[];
    applicationStatus?: 'not-applied' | 'applied' | 'interview' | 'rejected' | 'offered';
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IScrapeRequest {
    source: string;
    keywords: string[];
    location: string;
    maxResults?: number;
}
export interface IScrapeResponse {
    message: string;
    jobCount: number;
    jobs?: IJob[];
}
export interface IAuthService {
    register(userData: any): Promise<{
        user: Omit<IUser, 'password'>;
        token: string;
    } | null>;
    login(credentials: any): Promise<{
        user: Omit<IUser, 'password'>;
        token: string;
    } | null>;
}
export interface IJobService {
    getAllJobs(): Promise<Omit<IJob, 'description'>[]>;
    startScraping(scrapeData: IScrapeRequest): Promise<IScrapeResponse>;
}
export interface IApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
//# sourceMappingURL=index.d.ts.map