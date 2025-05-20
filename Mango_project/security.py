from datetime import timedelta
from django.conf import settings

# JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': settings.SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# Django-Axes settings for rate limiting
AXES_FAILURE_LIMIT = 5  # Number of login attempts allowed before lockout
AXES_LOCK_OUT_AT_FAILURE = True  # Lock out after failure limit is reached
AXES_COOLOFF_TIME = 1  # Lock out for 1 hour (you can adjust this)
AXES_RESET_ON_SUCCESS = True  # Reset the number of failed attempts on success
AXES_LOCKOUT_TEMPLATE = None  # Use the default lockout response
AXES_LOCKOUT_URL = None  # No special lockout URL
AXES_USERNAME_FORM_FIELD = 'username'  # The username field name in your login form
AXES_ONLY_USER_FAILURES = False  # Count failures based on both username and IP
AXES_ENABLE_ADMIN = True  # Enable the axes admin interface

# Two-factor authentication settings
TWO_FACTOR_PATCH_ADMIN = True  # Patch the admin site
TWO_FACTOR_CALL_GATEWAY = None  # No call gateway by default
TWO_FACTOR_SMS_GATEWAY = None  # No SMS gateway by default
TWO_FACTOR_TOTP_DIGITS = 6  # Number of digits in TOTP tokens