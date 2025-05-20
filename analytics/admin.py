from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.utils.html import format_html
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.db.models import Sum, Count, Avg, F, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import SavedReport, ReportSchedule, Dashboard
from .reports import SalesReport, InventoryReport, PaymentsReport, VendorReport
from tenants.models import Tenant
import json

class SavedReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'report_type', 'created_by', 'created_at', 'is_public', 'actions_buttons')
    list_filter = ('report_type', 'is_public', 'created_at')
    search_fields = ('name', 'description', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Filter by tenant
        try:
            profile = request.user.profile
            return qs.filter(tenant=profile.tenant)
        except:
            return qs.none()
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set these on creation
            obj.created_by = request.user
            try:
                obj.tenant = request.user.profile.tenant
            except:
                pass
        super().save_model(request, obj, form, change)
    
    def actions_buttons(self, obj):
        return format_html(
            '<a class="button" href="{}">Run</a> '
            '<a class="button" href="{}">Schedule</a>',
            f'/admin/analytics/run-report/{obj.id}/',
            f'/admin/analytics/savedreport/{obj.id}/schedule/'
        )
    actions_buttons.short_description = 'Actions'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('run-report/<int:report_id>/', self.admin_site.admin_view(self.run_report_view), name='run-report'),
            path('savedreport/<int:report_id>/schedule/', self.admin_site.admin_view(self.schedule_report_view), name='schedule-report'),
        ]
        return custom_urls + urls
    
    @method_decorator(staff_member_required)
    def run_report_view(self, request, report_id):
        report = SavedReport.objects.get(id=report_id)
        
        if request.method == 'POST':
            start_date = request.POST.get('start_date')
            end_date = request.POST.get('end_date')
            export_format = request.POST.get('export_format', report.default_format)
            
            # Convert string dates to datetime objects
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date() if start_date else None
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date() if end_date else None
            
            # Generate the report
            report_generator = self.get_report_generator(report, start_date, end_date)
            
            # Export in the requested format
            if export_format == 'pdf':
                buffer = report_generator.to_pdf()
                response = HttpResponse(buffer.read(), content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="{report.name}.pdf"'
                return response
            elif export_format == 'excel':
                buffer = report_generator.to_excel()
                response = HttpResponse(buffer.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                response['Content-Disposition'] = f'attachment; filename="{report.name}.xlsx"'
                return response
            elif export_format == 'csv':
                buffer = report_generator.to_csv()
                response = HttpResponse(buffer.read(), content_type='text/csv')
                response['Content-Disposition'] = f'attachment; filename="{report.name}.csv"'
                return response
        
        # Default date range (last 30 days)
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        context = {
            'report': report,
            'start_date': start_date,
            'end_date': end_date,
            'title': f'Run Report: {report.name}',
            'opts': self.model._meta,
        }
        return render(request, 'admin/analytics/run_report.html', context)
    
    @method_decorator(staff_member_required)
    def schedule_report_view(self, request, report_id):
        report = SavedReport.objects.get(id=report_id)
        
        if request.method == 'POST':
            # Create or update schedule
            schedule, created = ReportSchedule.objects.get_or_create(
                report=report,
                defaults={
                    'frequency': request.POST.get('frequency'),
                    'time': request.POST.get('time'),
                }
            )
            
            if not created:
                schedule.frequency = request.POST.get('frequency')
                schedule.time = request.POST.get('time')
            
            # Handle frequency-specific fields
            if schedule.frequency == 'weekly':
                schedule.weekday = request.POST.get('weekday')
            elif schedule.frequency in ['monthly', 'quarterly']:
                schedule.day_of_month = request.POST.get('day_of_month')
            
            schedule.is_active = 'is_active' in request.POST
            schedule.additional_emails = request.POST.get('additional_emails', '')
            schedule.save()
            
            # Handle recipients
            schedule.recipients.clear()
            for user_id in request.POST.getlist('recipients'):
                schedule.recipients.add(user_id)
            
            messages.success(request, f'Schedule for {report.name} has been updated.')
            return redirect('admin:analytics_savedreport_changelist')
        
        # Get or initialize schedule
        try:
            schedule = ReportSchedule.objects.get(report=report)
        except ReportSchedule.DoesNotExist:
            schedule = None
        
        context = {
            'report': report,
            'schedule': schedule,
            'title': f'Schedule Report: {report.name}',
            'opts': self.model._meta,
        }
        return render(request, 'admin/analytics/schedule_report.html', context)
    
    def get_report_generator(self, report, start_date=None, end_date=None):
        """Get the appropriate report generator based on report type"""
        tenant = report.tenant
        
        if report.report_type == 'sales':
            return SalesReport(tenant, start_date, end_date)
        elif report.report_type == 'inventory':
            return InventoryReport(tenant, start_date, end_date)
        elif report.report_type == 'payments':
            return PaymentsReport(tenant, start_date, end_date)
        elif report.report_type == 'vendors':
            return VendorReport(tenant, start_date, end_date)
        else:
            # Default to sales report
            return SalesReport(tenant, start_date, end_date)


class ReportScheduleAdmin(admin.ModelAdmin):
    list_display = ('report', 'frequency', 'time', 'is_active', 'last_run', 'last_status')
    list_filter = ('frequency', 'is_active', 'last_run')
    search_fields = ('report__name',)
    readonly_fields = ('last_run', 'last_status')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Filter by tenant
        try:
            profile = request.user.profile
            return qs.filter(report__tenant=profile.tenant)
        except:
            return qs.none()


class DashboardAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'created_at', 'is_public', 'is_default')
    list_filter = ('is_public', 'is_default', 'created_at')
    search_fields = ('name', 'description', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Filter by tenant
        try:
            profile = request.user.profile
            return qs.filter(tenant=profile.tenant)
        except:
            return qs.none()
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set these on creation
            obj.created_by = request.user
            try:
                obj.tenant = request.user.profile.tenant
            except:
                pass
        super().save_model(request, obj, form, change)


# Register models
admin.site.register(SavedReport, SavedReportAdmin)
admin.site.register(ReportSchedule, ReportScheduleAdmin)
admin.site.register(Dashboard, DashboardAdmin)


# Add analytics dashboard view
@staff_member_required
def analytics_dashboard_view(request):
    """Main analytics dashboard view"""
    
    # Get tenant for the current user
    tenant = None
    try:
        tenant = request.user.profile.tenant
    except:
        if request.user.is_superuser:
            # For superusers, use the first tenant or allow selection
            tenant = Tenant.objects.first()
    
    if not tenant:
        messages.error(request, "No tenant found. Please create a tenant first.")
        return redirect('admin:index')
    
    # Date range for analytics
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=30)  # Last 30 days by default
    
    # Get date range from request if provided
    if request.method == 'POST':
        start_date = datetime.strptime(request.POST.get('start_date', ''), '%Y-%m-%d').date()
        end_date = datetime.strptime(request.POST.get('end_date', ''), '%Y-%m-%d').date()
    
    # Generate reports
    sales_report = SalesReport(tenant, start_date, end_date)
    sales_report.generate_data()
    
    inventory_report = InventoryReport(tenant)
    inventory_report.generate_data()
    
    payments_report = PaymentsReport(tenant, start_date, end_date)
    payments_report.generate_data()
    
    vendor_report = VendorReport(tenant, start_date, end_date)
    vendor_report.generate_data()
    
    # Prepare context
    context = {
        'title': 'Analytics Dashboard',
        'tenant': tenant,
        'start_date': start_date,
        'end_date': end_date,
        'sales_summary': sales_report.summary if hasattr(sales_report, 'summary') else {},
        'inventory_summary': inventory_report.summary if hasattr(inventory_report, 'summary') else {},
        'payments_summary': payments_report.summary if hasattr(payments_report, 'summary') else {},
        'vendor_summary': vendor_report.summary if hasattr(vendor_report, 'summary') else {},
    }
    
    return render(request, 'admin/analytics/dashboard.html', context)

# Instead of using admin.site.register_view which requires django-admin-tools
# We'll add this view to urls.py instead
# Comment out the following line:
# admin.site.register_view('analytics/dashboard/', view=analytics_dashboard_view, name='Analytics Dashboard')