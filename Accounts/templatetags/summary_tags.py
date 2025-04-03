from django import template
from decimal import Decimal

register = template.Library()

@register.filter
def dictsumby(value, arg):
    """
    Sums up a list of dictionaries by a given key
    Example: {{ vendors|dictsumby:'total_due' }}
    """
    total = Decimal('0.00')
    for item in value:
        try:
            total += item[arg] or Decimal('0.00')
        except (KeyError, TypeError):
            try:
                total += getattr(item, arg) or Decimal('0.00')
            except (AttributeError, TypeError):
                pass
    return total 