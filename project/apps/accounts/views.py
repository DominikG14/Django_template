from django.http import HttpRequest, HttpResponse, HttpResponseRedirect

# Authentication imports
from django.contrib import auth
from django.contrib.auth import get_user_model
from tokens import account_activation_token

# Activation imports
from django.utils.encoding import force_str  
from django.utils.http import urlsafe_base64_decode 

# Views imports
from django.shortcuts import render, redirect
from utils.views import get_template
from . import urls, forms


def login(request: HttpRequest) -> HttpResponse:
    template = get_template(app=urls.app_name)
    context = {}

    if request.method == 'GET':
        form = forms.LoginForm()

    if request.method == 'POST':
        form = forms.LoginForm(request.POST) 
        if form.is_valid():
            user = auth.authenticate(request,
                username=form.cleaned_data.get('email'),
                password=form.cleaned_data.get('password'),
            )
            if user:
                auth.login(request, user)
                return redirect('') #TODO: Add after login destination
    
    context['form'] = form
    return render(request, template, context)


def register(request: HttpRequest) -> HttpResponse | HttpResponseRedirect:
    template = get_template(app=urls.app_name)
    context = {}

    if request.method == 'GET':
        form = forms.RegisterForm()

    if request.method == 'POST': 
            form = forms.RegisterForm(request.POST)
            if form.is_valid():
                form.send_email_activation(request)
                request.session['activation'] = True
                return redirect('accounts:activation_send')

    context['form'] = form
    return render(request, template, context)


def logout(request):
    auth.logout(request)
    return redirect('accounts:login')


def activation_send(request: HttpRequest) -> HttpResponse | HttpResponseRedirect:
    if request.session.get('activation') == False:
        return redirect('accounts:login')

    template = get_template(app=urls.app_name)
    context = {}

    return render(request, template, context)


def activate(request: HttpRequest, uidb64, token) -> HttpResponseRedirect:
    if request.session.get('activation') == False:
        return redirect('accounts:login')
    
    request.session['activation'] = False
    User = get_user_model()

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect('accounts:activation_succes')
    return redirect('accounts:activation_fail')


def activation_succes(request: HttpRequest) -> HttpResponse | HttpResponseRedirect:
    if request.session.get('activation') == False:
        return redirect('accounts:login')

    template = get_template(app=urls.app_name)
    context = {}

    return render(request, template, context)


def activation_fail(request: HttpRequest) -> HttpResponse | HttpResponseRedirect:
    if request.session.get('activation') == False:
        return redirect('accounts:login')

    template = get_template(app=urls.app_name)
    context = {}

    return render(request, template, context)