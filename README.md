# Work Order Management Application

A modern, responsive work order management application built with SvelteKit 5, TypeScript, and a clean, professional UI.

## Features

- User authentication and authorization
- Work order management (create, read, update, delete)
- User management (create, read, update, delete)
- Dashboard with key metrics and recent work orders
- Responsive design with modern UI
- Sortable tables
- Profile settings and password management

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd work-order-app
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Type Checking

Run TypeScript type checking:
```bash
npm run check
```

## Testing

Run tests:
```bash
npm run test
```

## Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable components
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── routes/
│   ├── +layout.svelte # Root layout with authentication
│   ├── +page.svelte   # Dashboard page
│   ├── login/         # Login page
│   ├── work-orders/   # Work orders management
│   ├── users/         # User management
│   └── settings/      # User settings
└── app.html           # HTML template
```

## API Integration

The application expects a REST API with the following endpoints:

- Authentication:
  - POST `/api/login`
  - GET `/api/auth/me`
  - PUT `/api/auth/profile`

- Work Orders:
  - GET `/api/work-orders`
  - POST `/api/work-orders`
  - PUT `/api/work-orders/:id`
  - DELETE `/api/work-orders/:id`

- Users:
  - GET `/api/users`
  - POST `/api/users`
  - PUT `/api/users/:id`
  - DELETE `/api/users/:id`

- Statistics:
  - GET `/api/stats`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
