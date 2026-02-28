using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAPI.Data;
using LibraryAPI.Models;
using LibraryAPI.DTOs;

namespace LibraryAPI.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class BooksController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly ILogger<BooksController> _logger;

        public BooksController(LibraryContext context, ILogger<BooksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // get all books 
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<BookResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BookResponseDto>>> GetBooks()
        {
            try
            {
                var books = await _context.Books
                    .OrderByDescending(b => b.CreatedAt)
                    .Select(b => MapToDto(b))
                    .ToListAsync();

                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving books");
                return StatusCode(500, new { message = "an error occurred while retrieving books." });
            }
        }

        // get a book by id
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(BookResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookResponseDto>> GetBook(int id)
        {
            try
            {
                var book = await _context.Books.FindAsync(id);

                if (book == null)
                {
                    _logger.LogWarning("Book with ID {Id} not found", id);
                    return NotFound(new { message = $"Book with ID {id} was not found." });
                }

                return Ok(MapToDto(book));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving book with ID {Id}", id);
                return StatusCode(500, new { message = "an error occurred while retrieving the book." });
            }
        }

        // get books with pagination
        [HttpGet("paged")]
        public async Task<ActionResult> GetBooksPaged(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6)
        {
            try
            {
                var totalCount = await _context.Books.CountAsync();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                var books = await _context.Books
                    .OrderByDescending(b => b.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(b => MapToDto(b))
                    .ToListAsync();

                return Ok(new
                {
                    data = books,
                    totalCount,
                    totalPages,
                    currentPage = page,
                    pageSize,
                    hasNextPage = page < totalPages,
                    hasPreviousPage = page > 1
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving paged books");
                return StatusCode(500, new { message = "An error occurred." });
            }
        }

        //  create a bok
        [HttpPost]
        [ProducesResponseType(typeof(BookResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<BookResponseDto>> CreateBook([FromBody] CreateBookDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var book = new Book
                {
                    Title = dto.Title.Trim(),
                    Author = dto.Author.Trim(),
                    Description = dto.Description?.Trim() ?? string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Created book with ID {Id}", book.Id);
                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, MapToDto(book));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating book");
                return StatusCode(500, new { message = "an error occurred while creating the book." });
            }
        }

        // update a book
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(BookResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookResponseDto>> UpdateBook(int id, [FromBody] UpdateBookDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var book = await _context.Books.FindAsync(id);

                if (book == null)
                {
                    _logger.LogWarning("Book with ID {Id} not found for update", id);
                    return NotFound(new { message = $"Book with ID {id} was not found." });
                }

                book.Title = dto.Title.Trim();
                book.Author = dto.Author.Trim();
                book.Description = dto.Description?.Trim() ?? string.Empty;
                book.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Updated book with ID {Id}", book.Id);
                return Ok(MapToDto(book));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating book with ID {Id}", id);
                return StatusCode(500, new { message = "an error occurred while updating  the book." });
            }
        }

        // delete a book
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                var book = await _context.Books.FindAsync(id);

                if (book == null)
                {
                    _logger.LogWarning("Book with ID {Id} not found for deletion", id);
                    return NotFound(new { message = $"Book with ID {id} was not found." });
                }

                _context.Books.Remove(book);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Deleted book with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book with ID {Id}", id);
                return StatusCode(500, new { message = "an error occurred while deleting the book." });
            }
        }

        // Helper: map Book entity to response DTO
        private static BookResponseDto MapToDto(Book book)
        {
            return new()
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Description = book.Description ?? string.Empty,
                CreatedAt = book.CreatedAt,
                UpdatedAt = book.UpdatedAt
            };
        }
    }
}