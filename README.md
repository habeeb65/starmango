# Starmango

A comprehensive multi-tenant SaaS application for wholesale fruit and vegetable businesses, focusing on inventory management, sales tracking, financial reporting, and advanced analytics.

## Project Overview

Starmango is a specialized ERP system designed for fruit and vegetable wholesalers, particularly those dealing with mangoes. The application allows multiple businesses to operate independently on the same platform through its multi-tenant architecture. Each business (tenant) has its own isolated data and users, ensuring complete separation of business operations.

## Latest Enhancements

### 1. Mobile Responsiveness and PWA Support
- Progressive Web App (PWA) capabilities for offline access
- Responsive design for all device sizes
- Mobile-first UI components
- App installation prompts for mobile users

### 2. Advanced Analytics and Reporting
- Comprehensive business analytics dashboard
- Customizable reports with multiple export formats (PDF, Excel, CSV)
- Scheduled report generation and delivery
- Visual data representation with charts and graphs

### 3. Inventory Forecasting and Optimization
- AI-powered inventory forecasting
- Multiple forecasting models (Moving Average, Exponential Smoothing, etc.)
- Inventory optimization rules and alerts
- Stockout and overstock prevention

### 4. Enhanced Multi-tenancy Features
- Customizable tenant branding and UI
- Tenant-specific feature flags
- Subscription plan management
- Localization settings per tenant

## Project Structure

The Starmango project follows a modular architecture with separated frontend and backend:

```
starmango/
├── frontend/                 # React frontend application
│   └── webapp/               # Main React application with Vite
│       ├── src/              # React source code
│       ├── public/           # Static assets
│       └── package.json      # Frontend dependencies
├── Mango_project/            # Django project settings
├── Accounts/                 # Authentication and user management
├── analytics/                # Business analytics and reporting
├── forecasting/              # Inventory forecasting features
├── tenants/                  # Multi-tenant core functionality
├── inventory/                # Inventory management
├── manage.py                 # Django management script
├── requirements.txt          # Backend dependencies
├── setup_and_run.bat         # Setup script for Windows
└── run_first.bat             # Initial dependency installation script
```

## Tech Stack

- **Backend**: Django with Django REST Framework
- **Frontend**: React with Chakra UI
- **Database**: Supports SQLite (development) and PostgreSQL (production)
- **Authentication**: Django's built-in authentication with JWT and custom multi-tenant extensions
- **Multi-tenancy**: Custom implementation using django-multitenant
- **Admin Interface**: Django Admin with Jazzmin for improved UI/UX
- **Analytics**: Pandas, Matplotlib for data processing and visualization
- **Forecasting**: Statistical models with NumPy and SciPy
- **PWA Support**: Service workers, workbox, and manifest.json
- **API**: Django REST Framework for backend API endpoints
- **Real-time Features**: Django Channels for WebSockets
- **Security**: Two-factor authentication, django-axes for brute force protection
- **Deployment**: Vercel for frontend, separate backend deployment

## Setup and Installation

### Prerequisites

- Python 3.12
- Node.js 18+ and npm
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/starmango.git
   cd starmango
   ```

2. **Run the setup script for dependencies**
   
   For Windows:
   ```bash
   run_first.bat
   ```

   For Linux/Mac:
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt
   pip install django-filter django-admin-tools drf-yasg channels django-import-export
   ```

3. **Start the development servers**

   For the complete stack:
   ```bash
   cd frontend
   npm run dev
   ```

   This will start both the Django backend server and React frontend with Vite.

## Deployment on Vercel

The Starmango project is structured to support deployment on Vercel with a separated backend, following modern best practices for SaaS applications.

### Frontend Deployment (Vercel)

1. **Prepare your frontend for Vercel**

   Create or update `frontend/webapp/vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "installCommand": "npm install"
   }
   ```

2. **Update API endpoints**
   
   Ensure your frontend API calls use environment variables for the backend URL:
   
   In your `.env` file:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. **Deploy to Vercel**
   
   ```bash
   cd frontend/webapp
   vercel --prod
   ```

### Backend Deployment Options

For the Django backend, you have several options:

1. **Separate server (recommended)**
   - Deploy on a VPS, AWS, or similar service
   - Set up with Gunicorn/uWSGI and Nginx
   - Configure appropriate environment variables

2. **Serverless approach**
   - Use Django Ninja or FastAPI for a more serverless-friendly API
   - Deploy as serverless functions (AWS Lambda, etc.)

3. **Containerization**
   - Create a Dockerfile for the project
   - Deploy using Docker to services like DigitalOcean, Heroku, or Render

## Environmental Variables

Configure these environment variables for your deployment:

```
# Django settings
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-backend-domain.com

# Database config
DATABASE_URL=postgresql://user:password@host:port/database

# Frontend URL for CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# JWT settings
JWT_EXPIRATION_DELTA=3600
```

## Multi-Tenant Considerations for Deployment

When deploying a multi-tenant application, consider these best practices:

1. **Database Isolation**: Ensure proper tenant isolation in your database
2. **Caching Strategy**: Implement tenant-aware caching
3. **Asset Storage**: Separate tenant files in storage systems
4. **Performance Monitoring**: Monitor per-tenant resource usage
5. **Backup Strategy**: Implement tenant-specific backup procedures

## Key Features

### Inventory Management

- **Product Tracking**: Define and track different types of products (fruits/vegetables)
- **Lot Management**: Track inventory by lots (PurchaseInvoice)
- **Purchase Recording**: Record purchases from vendors with detailed metrics
  - Quantity, price, damage, discount, rotten percentage
  - Net weight calculations
  - Payment tracking
- **Inventory Forecasting**: Predict future inventory needs
  - Multiple forecasting models (Moving Average, Exponential Smoothing, ARIMA, Prophet, LSTM)
  - Accuracy metrics and model comparison
  - Visualization of forecast trends
- **Inventory Optimization**: Optimize inventory levels
  - Automatic reorder point calculation
  - Safety stock recommendations
  - Stockout and overstock alerts

### Sales Management

- **Sales Invoices**: Create detailed sales invoices
- **Customer Management**: Track customer information and transactions
- **Credit Limits**: Set and monitor customer credit limits
- **Lot Tracking**: Track which purchase lots are used in each sale

### Financial Tracking

- **Purchase Payments**: Track payments to vendors
- **Sales Payments**: Track payments from customers
- **Payment Methods**: Support for cash, UPI, and account payments
- **Payment Attachments**: Upload receipts/proofs of payment
- **Credit Dashboard**: Monitor outstanding balances

### Analytics and Reporting

- **Advanced Analytics**: Comprehensive business intelligence
  - Sales trends and patterns
  - Inventory turnover analysis
  - Vendor performance metrics
  - Customer buying patterns
- **Customizable Reports**: Create and save custom report configurations
  - Multiple export formats (PDF, Excel, CSV)
  - Scheduled report generation
  - Email delivery of reports
- **Interactive Dashboards**: Visual representation of business data
  - Customizable widgets and layouts
  - Real-time data updates
  - Drill-down capabilities
- **Financial Reports**: Track profits, losses, and inventory value
- **Customer Statements**: Generate customer account statements
- **Vendor Statements**: Track payments to vendors

### Operational Features

- **Expense Tracking**: Record and categorize business expenses
- **Damages/Losses**: Track inventory losses and damages
- **Multi-user Support**: Allow multiple users per tenant with different permissions
- **Packaging**: Track packaging costs and crates
- **Mobile Access**: Access the system from any device
  - Progressive Web App (PWA) for offline capabilities
  - Responsive design for all screen sizes
  - Touch-optimized interface
- **Real-time Notifications**: Stay informed about important events
  - Inventory alerts
  - Payment notifications
  - System updates
  - Custom alert thresholds
- **Multi-language Support**: Localized interface for different regions
- **Data Export/Import**: Flexible data exchange options

## Database Structure

The application uses a horizontal partitioning approach for tenant isolation, where:

- All business models include a tenant foreign key
- Custom TenantManager ensures queries are filtered by the current tenant
- Models inherit from TenantModelMixin for consistent behavior

Example:

```python
class Product(TenantModelMixin, models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    name = models.CharField(max_length=100)
    objects = TenantManager()
    
    class Meta:
        unique_together = (('tenant', 'name'),)
```

## Project Structure

```
starmango/
├── Accounts/               # Core business logic app
│   ├── admin.py           # Admin panel configuration
│   ├── admin_csv.py       # CSV export functionality
│   ├── models.py          # Business models (Products, Invoices, etc.)
│   ├── views.py           # Business logic views
│   └── templates/         # Business-specific templates
├── analytics/             # Analytics and reporting app
│   ├── models.py          # Report models and configurations
│   ├── reports.py         # Report generation logic
│   └── templates/         # Report templates
├── forecasting/           # Inventory forecasting app
│   ├── models.py          # Forecasting models and configurations
│   ├── forecasting.py     # Forecasting algorithms
│   └── templates/         # Forecasting templates
├── Mango_project/         # Project settings
│   ├── settings.py        # Django settings
│   ├── urls.py            # Main URL configuration
│   └── wsgi.py            # WSGI configuration
├── frontend/              # React frontend
│   ├── webapp/            # Main React application
│   └── webapp-libs/       # Shared React components and utilities
├── tenants/               # Multi-tenant implementation
│   ├── middleware.py      # Tenant context middleware
│   ├── models.py          # Tenant, UserProfile, and TenantSettings models
│   └── views.py           # Tenant management views
├── notifications/         # Notification system
│   ├── models.py          # Notification models
│   └── consumers.py       # WebSocket consumers
├── templates/             # Global templates
│   └── admin/             # Admin template overrides
├── static/                # Static files (CSS, JS, images)
├── docs/                  # Documentation
├── manage.py              # Django management script
└── requirements.txt       # Python dependencies
```

## Prerequisites

- Node.js (v18+)
- Python (3.9+)
- pip (Python package manager)
- npm or yarn (Node.js package manager)
- PostgreSQL (recommended for production)
- Redis (for WebSockets and caching)

## Installation and Setup

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/starmango.git
   cd starmango
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Install additional packages for analytics and forecasting:
   ```bash
   pip install pandas matplotlib numpy scipy
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser (platform admin):
   ```bash
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   cd frontend/webapp
   npm install
   ```

2. Install PWA and mobile support packages:
   ```bash
   npm install workbox-window react-pwa-install vite-plugin-pwa
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. For full-stack development, run both servers:
   ```bash
   # In one terminal (from project root)
   python manage.py runserver
   
   # In another terminal
   cd frontend/webapp
   npm run dev
   ```

## Development Workflow

### Creating a New Tenant

1. Visit `/register/` to create a new tenant through the UI
2. OR use Django admin to create a tenant and associated user

### Adding New Business Models

When creating new business models, always follow the tenant-aware pattern:

```python
from django_multitenant.mixins import TenantModelMixin
from tenants.models import Tenant

class YourModel(TenantModelMixin, models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    # ... your fields
    objects = TenantManager()
```

### Testing Multi-Tenant Features

1. Create multiple test tenants
2. Test data isolation between tenants
3. Test tenant-specific admin views and permissions

## API Documentation

The Starmango API is built with Django REST Framework and follows RESTful principles.

- API root: `/api/`
- Authentication: Token-based authentication
- Tenant context: Provided via URL (`/api/{tenant-slug}/`) or request header (`X-Tenant`)

## Deployment

### Requirements

- Python 3.8+
- Node.js 16+
- PostgreSQL (recommended for production)

### Production Deployment

1. Configure production settings in `Mango_project/settings.py`
2. Set up a production database (PostgreSQL recommended)
3. Set up static file serving with Nginx or similar
4. Use Gunicorn or uWSGI as the WSGI server
5. Build the React frontend with `npm run build`

## Troubleshooting

### Common Issues

1. **Tenant context errors**: Ensure middleware is properly configured
2. **Missing tenant in queries**: Verify TenantManager is being used
3. **User access issues**: Check UserProfile tenant association
4. **Forecasting errors**: Ensure required Python packages are installed (pandas, numpy, matplotlib)
5. **PWA not working**: Check service worker registration and manifest.json configuration
6. **Analytics not displaying**: Verify data access permissions and database connections
7. **Mobile responsiveness issues**: Test with different device sizes and orientations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
