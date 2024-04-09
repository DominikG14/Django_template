from django.http import HttpRequest

# Mailing imports
from django.core.mail import EmailMessage
from django.contrib.auth import get_user_model
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from . import tokens

# Form creation imports
from django import forms
from django.contrib.auth.forms import UserCreationForm  
from django.contrib.auth import get_user_model


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)


class RegisterForm(UserCreationForm):  
    email = forms.EmailField(max_length=200, help_text='Required')  
    class Meta:  
        model = get_user_model() 
        fields = [
            'username',
            'nickname',
            'email',
            'password1',
            'password2'
        ]

    def save(self, commit=True):
        user = super().save(commit=False)

        nickname = self.cleaned_data.get('nickname')
        if not nickname:
            username = self.cleaned_data.get('username')
            user.nickname = username

        if commit:
            user.save()

        return user
    
    def send_email_activation(self, request: HttpRequest,) -> None:
        user = self.save(commit=False)
        user.is_active = False
        user.save()

        current_site = get_current_site(request)  
        mail_subject = '' # TODO: Add subject
        message = render_to_string('accounts/activation-email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': tokens.account_activation_token.make_token(user),
            'protocol': 'https' if request.is_secure() else 'http',
        })
        to_email = self.cleaned_data.get('email')
        email = EmailMessage(mail_subject, message, to=[to_email])
        email.send()