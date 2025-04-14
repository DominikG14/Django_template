import os
import importlib
from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Delete all migration files (except __init__.py) from all project apps"

    def handle(self, *args, **options):
        deleted_files = 0
        for app in settings.INSTALLED_APPS:
            if app.startswith("django."):
                continue  # Skip built-in Django apps

            try:
                mod = importlib.import_module(app)
            except ModuleNotFoundError:
                self.stdout.write(self.style.WARNING(f"App '{app}' not found. Skipping."))
                continue

            app_path = os.path.dirname(mod.__file__)
            migrations_path = os.path.join(app_path, "migrations")

            if not os.path.isdir(migrations_path):
                continue

            for file in os.listdir(migrations_path):
                file_path = os.path.join(migrations_path, file)
                if file != "__init__.py" and file.endswith(".py"):
                    os.remove(file_path)
                    deleted_files += 1
                elif file.endswith(".pyc"):
                    os.remove(file_path)
                    deleted_files += 1

        self.stdout.write(self.style.SUCCESS(f"Deleted {deleted_files} migration files."))