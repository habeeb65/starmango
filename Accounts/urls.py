from django.urls import path
from . import views  # Import views directly from the current module


urlpatterns = [
    path('create-invoice/', views.create_invoice, name='create_invoice'),
    path('invoice/<int:invoice_id>/pdf/', views.generate_invoice_pdf, name='generate_invoice_pdf'),  # Use views.generate_invoice_pdf
    path('Accountvendor_summary/', views.vendor_summary, name='vendor_summary'),
    path('expense/<int:pk>/pdf/', views.generate_expense_pdf, name='generate_expense_pdf'),
    path('damage/<int:pk>/pdf/', views.generate_damage_pdf, name='generate_damage_pdf'),
    path('packaging_invoice/<int:invoice_id>/pdf/', views.generate_packaging_invoice_pdf, name='generate_packaging_pdf'),
    
    

]
