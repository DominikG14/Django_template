from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Runs makemigrations and migrate in one go.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Running makemigrations...'))
        try:
            call_command('makemigrations')
        except CommandError as e:
            self.stdout.write(self.style.ERROR(f"makemigrations failed: {e}"))
            return

        self.stdout.write(self.style.NOTICE('Running migrate...'))
        try:
            call_command('migrate')
        except CommandError as e:
            self.stdout.write(self.style.ERROR(f"migrate failed: {e}"))
            return

        self.stdout.write(self.style.SUCCESS('Successfully ran makemigrations and migrate.'))