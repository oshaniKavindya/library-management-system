import { useState, useEffect } from "react";
import { Book, CreateBookPayload } from "../types/book";
import { XMarkIcon } from "./icons";

interface Props {
  book?: Book | null; // if provided → edit mode
  onSubmit: (payload: CreateBookPayload) => Promise<boolean>;
  onClose: () => void;
}

interface FormErrors {
  title?: string;
  author?: string;
  description?: string;
}

export default function BookForm({ book, onSubmit, onClose }: Props) {
  const isEditing = Boolean(book);

  const [form, setForm] = useState({
    title: book?.title ?? "",
    author: book?.author ?? "",
    description: book?.description ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Sync form when switching between add/edit
  useEffect(() => {
    setForm({
      title: book?.title ?? "",
      author: book?.author ?? "",
      description: book?.description ?? "",
    });
    setErrors({});
  }, [book]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    else if (form.title.length > 200) newErrors.title = "Max 200 characters.";
    if (!form.author.trim()) newErrors.author = "Author is required.";
    else if (form.author.length > 150) newErrors.author = "Max 150 characters.";
    if (form.description.length > 1000)
      newErrors.description = "Max 1000 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const success = await onSubmit(form);
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. The Pragmatic Programmer"
              className={`input-field ${errors.title ? "border-red-400 focus:ring-red-400" : ""}`}
              maxLength={200}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.author}
              onChange={(e) =>
                setForm((f) => ({ ...f, author: e.target.value }))
              }
              placeholder="e.g. Robert C. Martin"
              className={`input-field ${errors.author ? "border-red-400 focus:ring-red-400" : ""}`}
              maxLength={150}
            />
            {errors.author && (
              <p className="mt-1 text-xs text-red-600">{errors.author}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Brief description of the book..."
              rows={3}
              maxLength={1000}
              className={`input-field resize-none ${errors.description ? "border-red-400 focus:ring-red-400" : ""}`}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">
                {form.description.length}/1000
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
