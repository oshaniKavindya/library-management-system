import { useState, useMemo, useEffect } from "react";
import { useBooks } from "../hooks/useBooks";
import { Book } from "../types/book";
import BookCard from "../components/BookCard";
import BookForm from "../components/BookForm";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { PlusIcon, MagnifyingGlassIcon } from "../components/icons";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; book: Book }
  | { type: "delete"; book: Book };

export default function BooksPage() {
  const {
    books,
    loading,
    error,
    createBook,
    updateBook,
    deleteBook,
    pagedBooks,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    fetchPagedBooks,
  } = useBooks();

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [search, setSearch] = useState("");

  // load first page on mount
  useEffect(() => {
    fetchPagedBooks(1)
  }, [])

  // reset to page 1 when search changes
  useEffect(() => {
    if (search) fetchPagedBooks(1)
  }, [search])

  // client side search filter on paged results
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return pagedBooks
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    )
  }, [pagedBooks, books, search])

  const handleFormSubmit = async (payload: {
    title: string;
    author: string;
    description: string;
  }) => {
    if (modal.type === "create") {
      const result = await createBook(payload)
      await fetchPagedBooks(currentPage)
      return result
    }
    if (modal.type === "edit") {
      const result = await updateBook(modal.book.id, payload)
      await fetchPagedBooks(currentPage)
      return result
    }
    return false
  }

  const handleDeleteConfirm = async () => {
    if (modal.type !== "delete") return
    await deleteBook(modal.book.id)
    // if last book on page, go back one page
    const newPage = pagedBooks.length === 1 && currentPage > 1
      ? currentPage - 1
      : currentPage
    await fetchPagedBooks(newPage)
    setModal({ type: "none" })
  }

  const handlePageChange = (page: number) => {
    fetchPagedBooks(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCount} {totalCount === 1 ? "book" : "books"} in your collection
          </p>
        </div>
        <button
          onClick={() => setModal({ type: "create" })}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          Add Book
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, author, or description..."
          className="input-field pl-9"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="card text-center py-12">
          <p className="text-red-600 font-medium">Failed to load books.</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="card text-center py-16">
          {search ? (
            <>
              <p className="font-medium text-gray-700">No books match your search.</p>
              <p className="text-sm text-gray-400 mt-1">Try a different keyword.</p>
            </>
          ) : (
            <>
              <p className="font-medium text-gray-700">Your library is empty.</p>
              <p className="text-sm text-gray-400 mt-1">Add your first book to get started.</p>
              <button
                onClick={() => setModal({ type: "create" })}
                className="btn-primary mt-4 inline-flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Book
              </button>
            </>
          )}
        </div>
      )}

      {/* Book Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={(b) => setModal({ type: "edit", book: b })}
              onDelete={(b) => setModal({ type: "delete", book: b })}
            />
          ))}
        </div>
      )}

      {/* Pagination — only show if more than 6 books and not searching */}
      {!loading && !error && !search && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">

          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Page info */}
      {!loading && !error && !search && totalPages > 1 && (
        <p className="text-center text-sm text-gray-400 mt-3">
          Page {currentPage} of {totalPages} — {totalCount} books total
        </p>
      )}

      {/* Modals */}
      {(modal.type === "create" || modal.type === "edit") && (
        <BookForm
          book={modal.type === "edit" ? modal.book : null}
          onSubmit={handleFormSubmit}
          onClose={() => setModal({ type: "none" })}
        />
      )}

      {modal.type === "delete" && (
        <DeleteConfirmModal
          book={modal.book}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setModal({ type: "none" })}
        />
      )}
    </div>
  )
}