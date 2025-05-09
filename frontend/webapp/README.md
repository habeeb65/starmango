# StarMango Frontend

This is the React frontend for the StarMango application, integrated with the Django backend.

## Setup

1. Make sure you have Node.js v18+ and npm v9+ installed
2. Install dependencies from the root of the project:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file to `.env` in the `packages/webapp` directory:
   ```bash
   cp packages/webapp/.env.example packages/webapp/.env
   ```
4. Update the `.env` file with your backend configuration

## Development

To start the development server:

```bash
# From the project root
npm run dev
```

This will start the React development server at http://localhost:5173 and proxy API requests to your Django backend.

## Features

- **Multi-tenant isolation**: Data is properly isolated by tenant
- **Authentication**: JWT-based authentication with token refresh
- **Responsive UI**: Built with Chakra UI for a responsive and accessible interface
- **API Integration**: Integrated with Django backend APIs
- **GraphQL Support**: Apollo client configured for GraphQL communication

## Architecture

The frontend uses a monorepo structure with the following packages:

- `webapp`: Main application code
- `webapp-api-client`: API client for communicating with the backend
- `webapp-core`: Shared utilities and styling
- `webapp-tenants`: Multi-tenant functionality

## Connect with Backend

The frontend is configured to connect to your Django backend at the URL specified in the `.env` file. Make sure your Django backend has CORS enabled and is accepting requests from the frontend origin.

## Multi-tenancy

The application implements multi-tenant isolation, ensuring that:

1. Users only see data from their own organization
2. Tenant selection is available on the landing page
3. All API requests include tenant context
4. Dashboard components display the current tenant information

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Base URL for the Django backend API |
| VITE_GRAPHQL_URL | URL for GraphQL endpoint |
| VITE_AUTH_ENABLED | Enable/disable authentication |
| VITE_AUTH_TOKEN_REFRESH_INTERVAL | Interval for refreshing auth tokens (in ms) |
| VITE_MULTI_TENANT_ENABLED | Enable/disable multi-tenancy |
| VITE_FEATURE_NOTIFICATIONS_ENABLED | Enable/disable notifications |
| VITE_APP_NAME | Application name |
| VITE_APP_VERSION | Application version |
