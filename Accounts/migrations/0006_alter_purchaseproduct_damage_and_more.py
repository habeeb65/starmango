# Generated by Django 5.1.7 on 2025-04-01 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Accounts", "0005_packaging_invoice"),
    ]

    operations = [
        migrations.AlterField(
            model_name="purchaseproduct",
            name="damage",
            field=models.DecimalField(
                decimal_places=2, default=0, max_digits=10, verbose_name="Damage (Kg)"
            ),
        ),
        migrations.AlterField(
            model_name="purchaseproduct",
            name="discount",
            field=models.DecimalField(
                decimal_places=2, default=0, max_digits=10, verbose_name="Discount (%)"
            ),
        ),
        migrations.AlterField(
            model_name="purchaseproduct",
            name="rotten",
            field=models.DecimalField(
                decimal_places=2, default=0, max_digits=10, verbose_name="Rotten (Kg)"
            ),
        ),
    ]
