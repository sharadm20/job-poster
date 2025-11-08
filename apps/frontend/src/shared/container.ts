// src/shared/container.ts

import { ApiService } from '@/services/api-service';
import { UserRepositoryImpl } from '@/services/user-repository-impl';
import { JobRepositoryImpl } from '@/services/job-repository-impl';
import { GetProfileUseCase } from '@/use-cases/user/get-profile';
import { UpdateProfileUseCase } from '@/use-cases/user/update-profile';
import { RegisterUseCase } from '@/use-cases/auth/register';
import { LoginUseCase } from '@/use-cases/auth/login';
import { LogoutUseCase } from '@/use-cases/auth/logout';
import { GetJobsUseCase } from '@/use-cases/job/get-jobs';
import { SearchJobsUseCase } from '@/use-cases/job/search-jobs';
import { ApplyToJobUseCase } from '@/use-cases/job/apply-to-job';

class Container {
  private apiService: ApiService;
  private userRepository: UserRepositoryImpl;
  private jobRepository: JobRepositoryImpl;

  constructor() {
    this.apiService = new ApiService();
    this.userRepository = new UserRepositoryImpl(this.apiService);
    this.jobRepository = new JobRepositoryImpl(this.apiService);
  }

  // User use cases
  get getProfileUseCase() {
    return new GetProfileUseCase(this.userRepository);
  }

  get updateProfileUseCase() {
    return new UpdateProfileUseCase(this.userRepository);
  }

  // Auth use cases  
  get registerUseCase() {
    return new RegisterUseCase(this.userRepository);
  }

  get loginUseCase() {
    return new LoginUseCase(this.userRepository);
  }

  get logoutUseCase() {
    return new LogoutUseCase(this.userRepository);
  }

  // Job use cases
  get getJobsUseCase() {
    return new GetJobsUseCase(this.jobRepository);
  }

  get searchJobsUseCase() {
    return new SearchJobsUseCase(this.jobRepository);
  }

  get applyToJobUseCase() {
    return new ApplyToJobUseCase(this.jobRepository);
  }
}

export const container = new Container();