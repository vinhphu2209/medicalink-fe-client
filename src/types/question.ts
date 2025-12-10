export type QuestionStatus = 'PENDING' | 'ANSWERED' | 'CLOSED';

export interface Specialty {
  id: string;
  name: string;
  slug: string;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorEmail: string;
  specialtyId: string;
  publicIds: string[];
  status: QuestionStatus;
  viewCount: number;
  answersCount: number;
  acceptedAnswersCount: number;
  createdAt: string;
  updatedAt: string;
  specialty?: Specialty | null;
}

export interface Answer {
  id: string;
  body: string;
  authorId: string;
  questionId: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  authorFullName: string;
}

export interface QuestionDetail {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorEmail: string;
  specialtyId: string;
  specialty: Specialty | null;
  publicIds: string[];
  status: QuestionStatus;
  viewCount: number;
  answersCount: number;
  acceptedAnswersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QuestionsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: QuestionStatus;
  specialtyId?: string;
}

export interface QuestionsListResponse {
  success: boolean;
  message: string;
  data: Question[];
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  meta: PaginationMeta;
}

export interface QuestionDetailResponse {
  success: boolean;
  message: string;
  data: QuestionDetail;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
}

export interface AnswersListResponse {
  success: boolean;
  message: string;
  data: Answer[];
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  meta: PaginationMeta;
}

export interface CreateQuestionData {
  title: string;
  body: string;
  authorName: string;
  authorEmail: string;
  specialtyId: string;
}
