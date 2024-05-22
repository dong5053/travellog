import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DJANGO_DB_NAME', 'travel_log'),
        'USER': os.environ.get('DJANGO_DB_USER', 'travel_admin'),
        'PASSWORD': os.environ.get('DJANGO_DB_PASSWORD', 'k8spass#'),
        'HOST': os.environ.get('DJANGO_DB_HOST', 'travel.db.com'),
        'PORT': os.environ.get('DJANGO_DB_PORT', '3306'),
    }
}

SECRET_KEY = 'django-insecure-4iy_31l!q4_-rbz-!^l#!wm=gwpz7=3*a+0)kuw-qf_r9skvc9'