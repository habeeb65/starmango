# First block from generate_invoice_pdf
# Only show payment details if hide_payments is not True
if not hide_payments:
    # Paid Amounts Section
    paid_data = [["Paid Amount", "Date"]]
    for payment in invoice.payments.all():  # Assuming 'payments' is a related name for payments in the PurchaseInvoice model
        paid_data.append([f"₹{payment.amount:.2f}", payment.date.strftime('%Y-%m-%d')])

    paid_data.append(["Total Paid:", f"₹{invoice.paid_amount:.2f}"])

    paid_table = Table(paid_data, colWidths=[2*inch, 1.8*inch])
    paid_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
        ('BACKGROUND', (0, 0), (0, 0), colors.yellow),  # Yellow header for "Paid Amount" and "Date"
        ('FONTNAME', (0, -1), (-1, -1), 'DejaVuSans-Bold'),  # Bold for Total Paid row
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  # Black text for header
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('FONTSIZE', (0, -1), (-1, -1), 12),  # Larger font for Total Paid
    ]))

# Second block from generate_sales_invoice_pdf
if not hide_payments:
    # Payment Details Section
    # Payment Details Section - Updated to match purchase invoice style
    paid_data = [["Paid Amount", "Date"]]
    for payment in invoice.payments.all():
        paid_data.append([f"₹{payment.amount:.2f}", payment.date.strftime('%Y-%m-%d')])
    paid_data.append(["Total Paid:", f"₹{invoice.paid_amount:.2f}"])

    paid_table = Table(paid_data, colWidths=[2*inch, 1.8*inch])
    paid_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
        ('BACKGROUND', (0, 0), (0, 0), colors.yellow),
        ('BACKGROUND', (1, 0), (1, 0), colors.yellow),
        ('FONTNAME', (0, -1), (-1, -1), 'DejaVuSans-Bold'),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('FONTSIZE', (0, -1), (-1, -1), 12),
    ]))

    # Payment Summary Table with yellow highlights
    payment_summary_data = [
        ["FINAL INVOICE TOTAL", f"₹{invoice.net_total_after_packaging:.2f}"],
        ["TOTAL PAID", f"₹{invoice.paid_amount:.2f}"],
        ["BALANCE DUE", f"₹{invoice.due_amount:.2f}"],
    ]
    
    payment_summary_table = Table(payment_summary_data, colWidths=[2.5*inch, 1.4*inch])
    payment_summary_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
        ('FONTNAME', (0, -1), (-1, -1), 'DejaVuSans-Bold'),
        ('BACKGROUND', (0, 0), (-1, 0), colors.yellow),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
    ]))

    # Combine payment tables side by side
    combined_payments = Table([[paid_table, payment_summary_table]],
                            colWidths=[4*inch, 4*inch])
    
    elements.append(combined_payments)
    elements.append(Spacer(1, 20)) 