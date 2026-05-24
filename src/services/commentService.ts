import api from '@/lib/api';
import type { ApiResponse, Comment } from '@/lib/types';

export const getComments = async (reportId: number | string) => {
  const { data } = await api.get<ApiResponse<Comment[]>>(`/comments/${reportId}`);
  return data;
};

export const addComment = async (body: string, report_id: number | string) => {
  const { data } = await api.post<ApiResponse>('/comments', { body, report_id });
  return data;
};

export const editComment = async (id: number | string, body: string) => {
  const { data } = await api.put<ApiResponse>(`/comments/${id}`, { body });
  return data;
};

export const deleteComment = async (id: number | string) => {
  const { data } = await api.delete<ApiResponse>(`/comments/${id}`);
  return data;
};
