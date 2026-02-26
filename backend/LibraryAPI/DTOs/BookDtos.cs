using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTOs
{
    ///<summary>
    /// DTO for creating a new book
    /// </summary>
    

    public class CreateBookDto
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required")]
        [MaxLength(150, ErrorMessage = "Author cannot exceed 150 characters")]
        public string Author { get; set; } = string.Empty;

        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; } = string.Empty;

    }

    ///<summary>
    /// DTO for updating an existing book
    /// </summary>
    

    public class UpdateBookDto
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required")]
        [MaxLength(150, ErrorMessage = "Author cannot exceed 150 characters")]
        public string Author { get; set; } = string.Empty;

        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; } = string.Empty;
    }

    ///<summary>
    /// DTO returned to the client representing a book
    /// </summary>
    public class BookResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}