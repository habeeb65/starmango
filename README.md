# Starmango

<<<<<<< HEAD
A modern web application built with Django and React, following a monorepo structure.
=======
A comprehensive multi-tenant SaaS application for wholesale fruit and vegetable businesses, focusing on inventory management, sales tracking, and financial reporting.

## Project Overview

Starmango is a specialized ERP system designed for fruit and vegetable wholesalers, particularly those dealing with mangoes. The application allows multiple businesses to operate independently on the same platform through its multi-tenant architecture. Each business (tenant) has its own isolated data and users, ensuring complete separation of business operations.

## Tech Stack

- **Backend**: Django 
- **Frontend**: React with Chakra UI
- **Database**: Supports SQLite (development) and PostgreSQL (production)
- **Authentication**: Django's built-in authentication with custom multi-tenant extensions
- **Multi-tenancy**: Custom implementation using django-multitenant
- **Admin Interface**: Django Admin with Jazzmin for improved UI/UX
- **API**: Django REST Framework for backend API endpoints
- **Deployment**: Supports standard Django deployment options

## Multi-Tenant Architecture

Starmango implements a multi-tenant architecture where each business operates in isolation:

### Tenant Model

```python
class Tenant(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    business_type = models.CharField(max_length=50, choices=[
        ('mango', 'Mango Wholesaler'),
        ('vegetable', 'Vegetable Wholesaler'),
        ('fruit', 'Mixed Fruit Wholesaler'),
    ], default='mango')
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    primary_color = models.CharField(max_length=7, default='#00897B')
```

### UserProfile Model

Each user is linked to a specific tenant through the UserProfile:

```python
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    is_tenant_admin = models.BooleanField(default=False)
```

### Tenant Settings

Each tenant can customize their business features:

```python
class TenantSettings(models.Model):
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='settings')
    enable_purchase_management = models.BooleanField(default=True)
    enable_sales_management = models.BooleanField(default=True)
    enable_credit_dashboard = models.BooleanField(default=True)
    dashboard_layout = models.CharField(max_length=20, default='standard')
```

## Signup and Account Creation Flow

1. New business owners register through a signup form
2. System creates:
   - A new Tenant record with a unique slug
   - An admin user (superuser) for the tenant
   - A UserProfile linking the admin to the tenant
   - Default TenantSettings
   - Initial sample data (products, customers, vendors) based on business type

```python
def register_tenant(request):
    """Register a new tenant with admin user"""
    if request.method == 'POST':
        form = TenantRegistrationForm(request.POST)
        if form.is_valid():
            # Create tenant
            tenant = Tenant.objects.create(
                name=form.cleaned_data['business_name'],
                slug=form.cleaned_data['slug'],
                business_type=form.cleaned_data['business_type']
            )
            
            # Create admin user for tenant
            admin_user = User.objects.create_user(
                username=form.cleaned_data['username'],
                email=form.cleaned_data['email'],
                password=form.cleaned_data['password'],
                is_staff=True
            )
            
            # Create tenant profile to link user to tenant
            UserProfile.objects.create(
                user=admin_user,
                tenant=tenant,
                is_tenant_admin=True
            )
```

## Admin Access Structure

Starmango uses Django's admin interface enhanced with Jazzmin for a modern UI. The admin experience is tenant-aware:

1. Super-admin can access all tenants' data
2. Tenant admins can only access their own tenant's data
3. TenantMiddleware ensures proper tenant context in admin views
4. Admin interfaces provide custom filters and actions for tenant-specific data

## Key Features

### Inventory Management

- **Product Tracking**: Define and track different types of products (fruits/vegetables)
- **Lot Management**: Track inventory by lots (PurchaseInvoice)
- **Purchase Recording**: Record purchases from vendors with detailed metrics
  - Quantity, price, damage, discount, rotten percentage
  - Net weight calculations
  - Payment tracking

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

### Reporting

- **CSV Export**: Export data to CSV for external analysis
- **Financial Reports**: Track profits, losses, and inventory value
- **Customer Statements**: Generate customer account statements
- **Vendor Statements**: Track payments to vendors

### Operational Features

- **Expense Tracking**: Record and categorize business expenses
- **Damages/Losses**: Track inventory losses and damages
- **Multi-user Support**: Allow multiple users per tenant with different permissions
- **Packaging**: Track packaging costs and crates

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
=======
├── Accounts/               # Core business logic app
│   ├── admin.py           # Admin panel configuration
│   ├── admin_csv.py       # CSV export functionality
│   ├── models.py          # Business models (Products, Invoices, etc.)
│   ├── views.py           # Business logic views
│   └── templates/         # Business-specific templates
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
├── templates/             # Global templates
│   └── admin/             # Admin template overrides
├── static/                # Static files (CSS, JS, images)
├── docs/                  # Documentation
├── manage.py              # Django management script
└── requirements.txt       # Python dependencies
```

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
>>>>>>> ef945993c546fefe7b15c21217d8b8fca874a3dc
   ```bash
   pip install -r requirements.txt
   ```

<<<<<<< HEAD
3. Set up the database:
=======
4. Run migrations:
>>>>>>> ef945993c546fefe7b15c21217d8b8fca874a3dc
   ```bash
   python manage.py migrate
   ```

<<<<<<< HEAD
4. Create a superuser (optional):
=======
5. Create a superuser (platform admin):
>>>>>>> ef945993c546fefe7b15c21217d8b8fca874a3dc
   ```bash
   python manage.py createsuperuser
   ```

<<<<<<< HEAD
=======
6. Run the development server:
   ```bash
   python manage.py runserver
   ```

>>>>>>> ef945993c546fefe7b15c21217d8b8fca874a3dc
### Frontend Setup

1. Install Node.js dependencies:
   ```bash
<<<<<<< HEAD
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
=======
   cd frontend/webapp
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. For full-stack development, run both servers:
   ```bash
   # In one terminal (from project root)
   npm run dev  # Uses the script in root package.json to run both servers
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
>>>>>>> ef945993c546fefe7b15c21217d8b8fca874a3dc

## Contributing

1. Fork the repository
2. Create a feature branch
<<<<<<< HEAD
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
=======
3. Submit a pull request

## License

This project is proprietary and confidential. Unauthorized use, reproduction, or distribution is prohibited.
>>>>>>> ef945993c546fefe7b15c21217d8b8fca874a3dc
