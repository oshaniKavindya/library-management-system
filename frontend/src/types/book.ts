export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  description: string;
}

export interface UpdateBookPayload {
  title: string;
  author: string;
  description: string;
}

export interface ApiError {
  message: string;
}
export interface PagedBooksResponse {
  data: Book[]
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}