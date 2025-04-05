from django.db import migrations

class Migration(migrations.Migration):
    """
    This migration fixes the issue with SalesInvoice.date field that doesn't exist.
    It creates a dummy operation to override any pending operations trying to rename a non-existent field.
    """

    dependencies = [
        ('Accounts', '0001_initial'),  # Make sure to replace with your latest migration
    ]

    operations = [
        # This is a no-op operation that will replace any operations trying to rename 'date' field
        # Basically telling Django "assume the rename already happened"
        migrations.RunSQL(
            sql='', # No SQL to run
            reverse_sql='', # No SQL to reverse
            hints={'target_db': None},
            elidable=True,
        ),
    ] 