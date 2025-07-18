# Generated by Django 5.1.8 on 2025-04-17 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Accounts', '0005_remove_salesinvoice_purchased_crates_total_manual'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='credit_limit',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Maximum credit limit allowed (0 means no specific limit)', max_digits=12),
        ),
    ]
