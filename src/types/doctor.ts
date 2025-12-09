import { PaginationMeta } from './blog';

export interface Doctor {
  id: string;
  fullName: string;
  degree: string;
  position: string[];
  avatarUrl: string;
  portrait: string;
  introduction: string;
  workLocations: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  specialties: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface DoctorListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  specialtyIds?: string[];
  workLocationIds?: string[];
}

export interface DoctorListResponse {
  success: boolean;
  message: string;
  data: Doctor[];
  meta: PaginationMeta;
}

export interface Specialty {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string; // Optional based on context
}
