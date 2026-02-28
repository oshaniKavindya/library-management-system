import { Book } from '../types/book'
import { PencilIcon, TrashIcon } from './icons'

interface Props {
  book: Book
  onEdit: (book: Book) => void
  onDelete: (book: Book) => void
}

export default function BookCard({ book, onEdit, onDelete }: Props) {
  const formattedDate = new Date(book.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      {/* Book Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-blue-600 font-medium mt-0.5">{book.author}</p>
        {book.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">Added {formattedDate}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(book)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit book"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(book)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete book"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}