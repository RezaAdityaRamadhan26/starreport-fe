export interface ApiResponse<T = unknown> {
  message: string;
  success: boolean;
  data?: T;
  token?: string;
  user?: User;
}

export interface User {
  id: number;
  username: string;
  role: 'user' | 'admin' | 'super_admin';
  profile_picture?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  role?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface Report {
  id: number;
  header: string;
  body: string;
  user_id?: number;
  author_name: string;
  author_avatar?: string;
  category_name: string;
  image: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  total_comments?: number;
  latitude?: number;
  longitude?: number;
}

export interface ReportFilters {
  status?: string;
  category_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateReportPayload {
  header: string;
  body: string;
  category_id: number;
  image?: File;
}

export interface Comment {
  id: number;
  body: string;
  created_at: string;
  author: string;
  author_avatar?: string;
  role: string;
  user_id?: number;
}

export interface Category {
  id: number;
  category_name: string;
}

export interface DashboardStat {
  status: string;
  total: number;
}
