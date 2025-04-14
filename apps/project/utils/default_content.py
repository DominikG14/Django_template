def get_redirects_content():
    return '''from django.http import HttpRequest, HttpResponseRedirect
from django.shortcuts import redirect

# Create your redirects here.
'''

def get_forms_content():
    return '''from django.http import HttpRequest
from . import models

# Create your forms here.
'''

def get_views_content():
    return '''from django.http import HttpRequest
from django.shortcuts import render, redirect

from project.utils.views import get_template

from . import urls
from . import models
from . import forms

# Create your views here.
'''

def get_base_html_content(app_name):
    return f'''{{% extends 'project/base.html' %}}
{{% load static %}}

{{% block base_static %}}
<link rel="stylesheet" href="{{% static '{app_name}/styles/base.css' %}}">
  {{% block static %}}
  {{% endblock static %}}
{{% endblock base_static %}}

{{% block base_content %}}
  {{% block content %}}
  {{% endblock content %}}
{{% endblock base_content %}}
'''

def get_admin_content():
    return '''from django.contrib import admin
from . import models

# Register your models here.
'''

def get_urls_content(app_name):
    return f'''from django.urls import path
from . import views, redirects


app_name = '{app_name}'
urlpatterns = []


VIEWS = []

REDIRECTS = []


urlpatterns += VIEWS
urlpatterns += REDIRECTS
'''

def get_templatetags_content():
    return f'''from django import template

register = template.Library()

# Register your custom template tags here.
'''