import os
import django
import subprocess
from django.contrib.auth import get_user_model


def run_command(command):
    print(f"Running: {' '.join(command)}")
    subprocess.run(command, check=True)

def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")  # Change 'project' to your Django project name
    django.setup()
    
    # Make migrations
    run_command(["python", "manage.py", "makemigrations"])
    
    # Apply migrations
    run_command(["python", "manage.py", "migrate"])
    
    # Create superuser

    User = get_user_model()
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser("admin", "admin@admin.com", "admin")
        print("Superuser created successfully.")
    else:
        print("Superuser already exists.")
    
    # Run server
    run_command(["python", "manage.py", "runserver"])

if __name__ == "__main__":
    main()
