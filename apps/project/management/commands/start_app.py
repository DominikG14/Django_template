import os
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command

from project.utils.default_content import *


class Command(BaseCommand):
    help = 'Creates a Django app with a custom folder structure and default files'

    def add_arguments(self, parser):
        parser.add_argument('name', type=str, help='Name of the app')

    def handle(self, *args, **options):
        app_name = options['name']
        self.stdout.write(self.style.NOTICE(f"Creating app '{app_name}'..."))

        # Step 1: Use Django's built-in startapp command to create the basic app
        call_command('startapp', app_name)

        app_path = os.path.join(os.getcwd(), app_name)
        if not os.path.exists(app_path):
            raise CommandError(f"App directory {app_path} was not created.")

        # Step 2: Create custom files with default code

        # Create redirects.py with default content
        with open(os.path.join(app_path, 'redirects.py'), 'w') as f:
            f.write(get_redirects_content())

        # Create forms.py with default content
        with open(os.path.join(app_path, 'forms.py'), 'w') as f:
            f.write(get_forms_content())

        # Create views.py with default content
        with open(os.path.join(app_path, 'views.py'), 'w') as f:
            f.write(get_views_content())

        # Step 3: Create templatetags directory and app_name_components.py with default code
        templatetags_path = os.path.join(app_path, 'templatetags')
        os.makedirs(templatetags_path, exist_ok=True)

        # Use the function to get the default content for the templatetags
        with open(os.path.join(templatetags_path, f'{app_name}_components.py'), 'w') as f:
            f.write(get_templatetags_content())

        # Step 4: Create templates directory and app_name base structure with default base.html
        templates_path = os.path.join(app_path, 'templates', app_name)
        os.makedirs(templates_path, exist_ok=True)
        os.makedirs(os.path.join(templates_path, 'components'), exist_ok=True)

        with open(os.path.join(templates_path, 'base.html'), 'w') as f:
            f.write(get_base_html_content(app_name))

        # Step 5: Create static directory with components, and empty base.scss
        static_root = os.path.join(app_path, 'static', app_name)
        scss_path = os.path.join(static_root, 'scss')
        os.makedirs(scss_path, exist_ok=True)
        os.makedirs(os.path.join(scss_path, 'components'), exist_ok=True)

        # Create base.scss as an empty file
        with open(os.path.join(scss_path, 'base.scss'), 'w') as f:
            f.write(get_base_scss_content())

        # Step 6: Create urls.py with default content
        with open(os.path.join(app_path, 'urls.py'), 'w') as f:
            f.write(get_urls_content(app_name))

        # Step 7: Create admin.py with default code
        with open(os.path.join(app_path, 'admin.py'), 'w') as f:
            f.write(get_admin_content())

        # Step 8: Create remaining static directories (styles, scripts, images)
        for subdir in ['styles', 'scripts', 'images']:
            os.makedirs(os.path.join(static_root, subdir), exist_ok=True)

        self.stdout.write(self.style.SUCCESS(f"Custom app '{app_name}' created successfully with default content!"))
