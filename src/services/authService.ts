import api from '@/lib/api';
import type { ApiResponse, LoginPayload, RegisterPayload, ChangePasswordPayload, User } from '@/lib/types';

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await api.post<ApiResponse & { token: string; user: User }>('/auth/login', payload);
  return data;
};

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post<ApiResponse>('/auth/register', payload);
  return data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await api.put<ApiResponse>('/auth/password', payload);
  return data;
};

export const updateProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('profile_picture', file);
  const { data } = await api.put<ApiResponse<{ profile_picture: string }>>('/users/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
