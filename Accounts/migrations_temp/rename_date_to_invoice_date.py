from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Accounts', '0006_salesinvoice_purchased_crates_quantity_and_more'),  # Updated to latest migration
    ]

    operations = [
        migrations.RenameField(
            model_name='salesinvoice',
            old_name='date',
            new_name='invoice_date',
        ),
    ] 