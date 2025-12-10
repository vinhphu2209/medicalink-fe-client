import { ApiResponse } from '@/types/api';
import type {
  AnswersListResponse,
  CreateQuestionData,
  Question,
  QuestionDetail,
  QuestionDetailResponse,
  QuestionsListParams,
  QuestionsListResponse,
} from '@/types/question';

import { apiClient } from './client';

export const questionApi = {
  getQuestions: async (
    params: QuestionsListParams
  ): Promise<QuestionsListResponse> => {
    const response = await apiClient.get<QuestionsListResponse>('/questions', {
      params,
    });
    return response.data;
  },

  getQuestionById: async (
    id: string,
    increaseView: boolean = false
  ): Promise<QuestionDetail> => {
    const response = await apiClient.get<QuestionDetailResponse>(
      `/questions/${id}`,
      {
        params: { increaseView },
      }
    );
    return response.data.data;
  },

  getQuestionAnswers: async (
    questionId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<AnswersListResponse> => {
    const endpoint = `/questions/${questionId}/answers/accepted`;

    const response = await apiClient.get<AnswersListResponse>(endpoint, {
      params,
    });
    return response.data;
  },

  createQuestion: async (data: CreateQuestionData): Promise<Question> => {
    const response = await apiClient.post<ApiResponse<Question>>(
      '/questions',
      data
    );
    return response.data.data;
  },
};
