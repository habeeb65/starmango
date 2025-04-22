# update_tenant_models.ps1
# PowerShell script to update models to be tenant-aware and migrate the database

Write-Host "StarMango Multi-tenant Migration Script" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# 1. Create initial migration for tenants if it doesn't exist
if (-not (Test-Path "tenants/migrations/0001_initial.py")) {
    Write-Host "Creating initial migration for tenants app..." -ForegroundColor Yellow
    python manage.py makemigrations tenants
} 
else {
    Write-Host "Tenants migration already exists" -ForegroundColor Cyan
}

# 2. Apply tenants migration if needed
Write-Host "Applying tenant migrations..." -ForegroundColor Yellow
python manage.py migrate tenants

# 3. Create default tenant if needed
Write-Host "Initializing default tenant..." -ForegroundColor Yellow
python manage.py initialize_default_tenant

# 4. Check if backup is needed
$backup = Read-Host "Do you want to backup the database before proceeding? (y/n)"
if ($backup -eq "y") {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "db_backup_$timestamp.sqlite3"
    Write-Host "Creating database backup to $backupFile..." -ForegroundColor Yellow
    Copy-Item "db.sqlite3" $backupFile
    Write-Host "Backup created" -ForegroundColor Green
}

# 5. Make migration for models
Write-Host "Before updating any model to be tenant-aware, modify it to:" -ForegroundColor Yellow
Write-Host "1. Add 'from django_multitenant.mixins import TenantModelMixin'" -ForegroundColor Cyan
Write-Host "2. Add 'from tenants.models import Tenant'" -ForegroundColor Cyan
Write-Host "3. Add 'tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)'" -ForegroundColor Cyan
Write-Host "4. Add 'tenant_id = 'tenant_id''" -ForegroundColor Cyan
Write-Host "5. Replace 'models.Model' with 'TenantModelMixin, models.Model'" -ForegroundColor Cyan

$continue = Read-Host "Have you updated your models? (y/n)"
if ($continue -eq "y") {
    Write-Host "Creating migrations for updated models..." -ForegroundColor Yellow
    python manage.py makemigrations Accounts
    
    # 6. Apply migrations
    Write-Host "Applying migrations..." -ForegroundColor Yellow
    python manage.py migrate
    
    # 7. Associate existing records with default tenant
    Write-Host "Running migrate_to_tenant command..." -ForegroundColor Yellow
    python manage.py migrate_to_tenant starmango
    
    Write-Host "Migration complete!" -ForegroundColor Green
} 
else {
    Write-Host "Migration cancelled. Update your models and run this script again." -ForegroundColor Red
} 