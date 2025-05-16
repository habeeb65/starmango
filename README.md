# Starmango

A modern web application built with Django and React, following a monorepo structure.

## Project Structure

```
starmango/
├── apps/                    # Backend Django applications
│   ├── accounts/           # User authentication and management
│   ├── core/               # Core functionality and utilities
│   └── ...
├── frontend/               # Frontend React application
│   ├── webapp/            # Main React application
│   └── webapp-libs/       # Shared frontend libraries
├── config/                # Configuration files
├── scripts/               # Utility scripts
├── docs/                  # Documentation
└── ...
```

## Prerequisites

- Node.js (v18+)
- Python (3.9+)
- pip (Python package manager)
- npm or yarn (Node.js package manager)

## Getting Started

### Backend Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up the database:
   ```bash
   python manage.py migrate
   ```

4. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Install frontend workspace dependencies:
   ```bash
   npm run setup:webapp
   ```

## Development

### Running the Development Servers

- Backend only:
  ```bash
  npm run dev:backend
  ```

- Frontend only:
  ```bash
  npm run dev:frontend
  ```

- Both frontend and backend (recommended):
  ```bash
  npm run dev
  ```

## Building for Production

```bash
# Build frontend assets
npm run build:frontend

# Collect static files
python manage.py collectstatic --noinput
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=starmango
DB_USER=user
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
