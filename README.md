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
- Svelte 5 Runes for reactive state management

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

3. Create a `.env` file in the root directory with the following variables:
```
VITE_API_BASE=http://localhost:8000
VITE_API_VERSION=/api/v1
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
│   ├── api/           # API client and services
│   │   ├── core/      # OpenAPI core functionality
│   │   ├── models/    # API data models
│   │   └── services/  # API service implementations
│   ├── components/    # Reusable components
│   ├── stores/        # Svelte stores for state management
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
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

The application uses a REST API with the following endpoints:

- Authentication:
  - POST `/api/v1/login/access-token` - Login and get access token
  - GET `/api/v1/users/me` - Get current user data

- Users:
  - GET `/api/v1/users/` - Get all users
  - POST `/api/v1/users/` - Create a new user
  - PUT `/api/v1/users/:id` - Update a user
  - DELETE `/api/v1/users/:id` - Delete a user

### API Configuration

The API client is configured in `src/lib/api/config.ts`:

```typescript
// Configure the OpenAPI client
OpenAPI.BASE = 'http://localhost:8000';
OpenAPI.VERSION = '/api/v1';
OpenAPI.WITH_CREDENTIALS = false;
OpenAPI.CREDENTIALS = 'include';

// Add a token resolver to automatically add the auth token to requests
OpenAPI.TOKEN = async () => {
  const token = localStorage.getItem('auth_token');
  return token || '';
};
```

### Authentication Flow

1. User logs in with email and password
2. The application receives an access token and refresh token
3. Tokens are stored in localStorage
4. The token resolver automatically adds the token to all API requests
5. If a request returns a 401 or 403, the user is redirected to the login page

### Regenerating the API Client

When the OpenAPI specification changes, regenerate the API client:

```bash
npx openapi-generator-cli generate -i http://localhost:8000/api/v1/openapi.json -g typescript-fetch -o ./src/lib/api
```

After regeneration, review the changes and update your code as needed.

## Svelte 5 Features

This application uses Svelte 5's new Runes syntax for reactive state management:

```typescript
// Using $state for reactive variables
let email = $state('');
let password = $state('');
let loading = $state(false);
let error = $state('');

// Using $effect for side effects
$effect(() => {
  if (user) {
    // User is logged in, perform actions
  }
});
```

## Environment Variables

The application uses the following environment variables:

- `VITE_API_BASE`: The base URL of the API
- `VITE_API_VERSION`: The API version path

These variables can be set in a `.env` file in the root directory. If not set, default values will be used.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
