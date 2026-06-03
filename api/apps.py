import os
from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        os.makedirs(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads'), exist_ok=True)
        try:
            from django.core.management import call_command
            call_command('seed_users', verbosity=0)
        except Exception:
            pass
