#  Library Management System

A full-stack web application for managing library book records, built with C# .NET 8 backend and React TypeScript frontend.

---

## Tech Stack

**Backend**
- C# .NET 8 Web API
- SQLite + Entity Framework Core 8
- Auth0 JWT Authentication
- Swagger / OpenAPI

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Auth0 

---

## Project Structure

```
library-management-system/
├── backend/
│   └── LibraryAPI/
│       ├── Controllers/        # API controllers
│       ├── Data/               # EF DbContext
│       ├── DTOs/               # Data transfer objects
│       ├── Migrations/         # EF migrations
│       ├── Models/             # Entity models
│       ├── appsettings.json
│       └── Program.cs
└── frontend/
    └── src/
        ├── components/         # Reusable UI components
        ├── hooks/              # Custom React hooks
        ├── pages/              # Page components
        ├── services/           # API service layer
        └── types/              # TypeScript interfaces
```



---

## Features

- Full CRUD operations for book records
- User authentication via Auth0
- Paginated book listing (6 books per page)
- Search and filter books by title, author, or description
- Responsive UI with Tailwind CSS
- Input validation on both frontend and backend
- SQLite database 