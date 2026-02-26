using Microsoft.EntityFrameworkCore;
using LibraryAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();

// SQLite + Entity Framework Core
builder.Services.AddDbContext<LibraryContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthorization();

var app = builder.Build();

// Auto-apply migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LibraryContext>();
    db.Database.Migrate();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();