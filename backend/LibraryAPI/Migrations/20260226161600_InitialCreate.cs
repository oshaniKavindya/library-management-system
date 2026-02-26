using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LibraryAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Author = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "Author", "CreatedAt", "Description", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Andrew Hunt, David Thomas", new DateTime(2026, 2, 26, 16, 15, 59, 597, DateTimeKind.Utc).AddTicks(8836), "A guide to software development best practices.", "The Pragmatic Programmer", new DateTime(2026, 2, 26, 16, 15, 59, 597, DateTimeKind.Utc).AddTicks(8836) },
                    { 2, "Robert C. Martin", new DateTime(2026, 2, 26, 16, 15, 59, 597, DateTimeKind.Utc).AddTicks(8839), "A handbook of agile software craftsmanship.", "Clean Code", new DateTime(2026, 2, 26, 16, 15, 59, 597, DateTimeKind.Utc).AddTicks(8839) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Books");
        }
    }
}
