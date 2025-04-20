from django import template
from django.db.models import Sum, F
from decimal import Decimal

register = template.Library()

@register.filter
def dictsumby(dict_list, key):
    """Sum a list of dictionaries or objects by a specific attribute or key"""
    total = 0
    for item in dict_list:
        try:
            # Try attribute access first (for objects)
            value = getattr(item, key, None)
            if value is None:
                # Fall back to dictionary access
                value = item.get(key, 0)
        except (AttributeError, KeyError):
            try:
                # Fall back to dictionary access
                value = item.get(key, 0)
            except (AttributeError, KeyError):
                value = 0
                
        # Convert to Decimal to handle different numeric types
        try:
            total += Decimal(value)
        except:
            pass
    
    return total

@register.filter
def mul(value, arg):
    """Multiply the value by the argument"""
    try:
        return Decimal(value) * Decimal(arg)
    except (ValueError, TypeError):
        return 0 

@register.filter
def sum_dict_values(dict_list, key):
    """Sum a specific key across a list of dictionaries"""
    try:
        return sum(item.get(key, 0) for item in dict_list)
    except (TypeError, KeyError, AttributeError):
        # Try to handle model objects
        try:
            return sum(getattr(item, key, 0) for item in dict_list)
        except:
            return 0
            
@register.filter
def multiply(value, arg):
    """Multiply a value by an argument"""
    try:
        return Decimal(str(value)) * Decimal(str(arg))
    except:
        return 0 