import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Book, CreateBookPayload, UpdateBookPayload } from "../types/book";
import { bookService } from "../services/bookService";
import toast from "react-hot-toast";

/**
 * Custom hook that wraps all book CRUD operations.
 * Handles loading states, error states, and Auth0 token injection.
 */
export const useBooks = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to get fresh token
  const getToken = useCallback(async () => {
    if (!isAuthenticated) return undefined;
    try {
      return await getAccessTokenSilently();
    } catch {
      return undefined;
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  // Fetch all books
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await bookService.getAll(token);
      setBooks(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load books.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Create a book
  const createBook = useCallback(
    async (payload: CreateBookPayload): Promise<boolean> => {
      try {
        const token = await getToken();
        const newBook = await bookService.create(payload, token);
        setBooks((prev) => [newBook, ...prev]);
        toast.success("Book added successfully!");
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to create book.";
        toast.error(message);
        return false;
      }
    },
    [getToken],
  );

  // Update a book
  const updateBook = useCallback(
    async (id: number, payload: UpdateBookPayload): Promise<boolean> => {
      try {
        const token = await getToken();
        const updated = await bookService.update(id, payload, token);
        setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
        toast.success("Book updated successfully!");
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to update book.";
        toast.error(message);
        return false;
      }
    },
    [getToken],
  );

  // Delete a book
  const deleteBook = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const token = await getToken();
        await bookService.delete(id, token);
        setBooks((prev) => prev.filter((b) => b.id !== id));
        toast.success("Book deleted.");
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to delete book.";
        toast.error(message);
        return false;
      }
    },
    [getToken],
  );

  const [pagedBooks, setPagedBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const pageSize = 6;

  const fetchPagedBooks = async (page: number = 1) => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const result = await bookService.getPaged(page, pageSize, token);
      setPagedBooks(result.data);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      setHasNextPage(result.hasNextPage);
      setHasPreviousPage(result.hasPreviousPage);
    } catch (err) {
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    pagedBooks,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    pageSize,
    fetchPagedBooks,
  };
};
