import axios from "axios";
import {
  Book,
  CreateBookPayload,
  PagedBooksResponse,
  UpdateBookPayload,
  
} from "../types/book";

const API_BASE = "/api/books";

// setup axios with auth token
export const createApiClient = (token?: string) => {
  const instance = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return instance;
};

export const bookService = {
  // get all books
  getAll: async (token?: string): Promise<Book[]> => {
    const client = createApiClient(token);
    const response = await client.get<Book[]>("");
    return response.data;
  },

  // get a book by id
  getById: async (id: number, token?: string): Promise<Book> => {
    const client = createApiClient(token);
    const response = await client.get<Book>(`/${id}`);
    return response.data;
  },

  //Create new book //
  create: async (payload: CreateBookPayload, token?: string): Promise<Book> => {
    const client = createApiClient(token);
    const response = await client.post<Book>("", payload);
    return response.data;
  },

  // Update book
  update: async (
    id: number,
    payload: UpdateBookPayload,
    token?: string,
  ): Promise<Book> => {
    const client = createApiClient(token);
    const response = await client.put<Book>(`/${id}`, payload);
    return response.data;
  },

  // Delete a book //
  delete: async (id: number, token?: string): Promise<void> => {
    const client = createApiClient(token);
    await client.delete(`/${id}`);
  },

  // get books(pagination)
  getPaged: async (
    page: number,
    pageSize: number,
    token?: string,
  ): Promise<PagedBooksResponse> => {
    const client = createApiClient(token);
    const response = await client.get<PagedBooksResponse>(
      `/paged?page=${page}&pageSize=${pageSize}`,
    );
    return response.data;
  },
};
