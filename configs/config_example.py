# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'SECRET_KEY'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': '10.5.0.5',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': 'SET default_storage_engine=INNODB',
            'autocommit': True,
        },
        'NAME': 'DB_NAME',
        'USER': 'USER',
        'PASSWORD': 'PWD',
    }
}

EMAIL_HOST: 'mail.domain.com.mx'
EMAIL_PORT: '465'
EMAIL_HOST_USER: 'correo@domain.com.mx'
EMAIL_HOST_PASSWORD: 'MAIL_PWD'
EMAIL_USE_SSL: True
DEFAULT_FROM_EMAIL: 'Sistemas IMGX<no-reply@domain.com.mx>'

STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_ROOT = BASE_DIR / 'media'
