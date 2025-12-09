// Repository Detail Type matching backend RepositoryDtos
export interface Asset {
  assetId: string;
  type: string;
  title: string;
  repoId: string;
  description?: string;
  createdAt?: string;
  lastUpdatedAt?: string;
  url: string;
}

export interface Exam {
  examId: string;
  repoId?: string;
  title: string;
  description?: string;
  startDatetime?: string;
  endDatetime?: string;
  duration?: number;
}

export interface RepositoryDetail {
  repoId: string;
  classId: string;
  repoName: string;
  repoDescription?: string;
  repoCertification?: string;
  createdAt?: string;
  status?: string;

  assets?: Asset[];
  exams?: Exam[];
}

// Repository List Type (simpler version)
export interface Repository {
  repoId: string;
  classId: string;
  repoName: string;
  repoDescription?: string;
  repoCertification?: string;
  createdAt?: string;
}

// Create Repository DTO
export interface CreateRepositoryDto {
  classId: string;
  repoName: string;
  repoDescription?: string;
  repoCertification?: string;
}

// Update Repository DTO
export interface UpdateRepositoryDto {
  repoName?: string;
  repoDescription?: string;
  repoCertification?: string;
}
