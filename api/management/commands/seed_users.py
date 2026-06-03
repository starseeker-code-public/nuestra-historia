import os
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create or update users from environment variables'

    def handle(self, *args, **kwargs):
        from api.models import User

        users = [
            {
                'username': os.getenv('USER1_USERNAME', 'el_hombre'),
                'display_name': os.getenv('USER1_DISPLAY_NAME', 'Él'),
                'role': 'hombre',
                'password': os.getenv('USER1_PASSWORD', 'changeme1'),
            },
            {
                'username': os.getenv('USER2_USERNAME', 'la_mujer'),
                'display_name': os.getenv('USER2_DISPLAY_NAME', 'Ella'),
                'role': 'mujer',
                'password': os.getenv('USER2_PASSWORD', 'changeme2'),
            },
        ]

        for data in users:
            password = data.pop('password')
            user, created = User.objects.update_or_create(
                username=data['username'],
                defaults={'display_name': data['display_name'], 'role': data['role']},
            )
            user.set_password(password)
            user.save()
            if kwargs.get('verbosity', 1) > 0:
                action = 'Created' if created else 'Updated'
                self.stdout.write(f'{action}: {data["username"]}')

        if kwargs.get('verbosity', 1) > 0:
            self.stdout.write(self.style.SUCCESS('Users seeded.'))
