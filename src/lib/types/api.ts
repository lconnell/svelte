export type ApiResponse<T> = {
  data: T;
  message?: string;
  error?: string;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  total: number;
  page: number;
  limit: number;
}; 