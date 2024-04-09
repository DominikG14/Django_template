from django.urls import path
from . import views, redirects


app_name = 'accounts'
urlpatterns = []


PATHS = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('activate/email/', views.activation_send, name='activation_send'),
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
    path('activate/succes/', views.activation_succes, name='activation_succes'),
    path('activate/fail/', views.activation_fail, name='activation_fail'),
]

REDIRECTS = [
    path('', redirects.login),
]


urlpatterns += PATHS
urlpatterns += REDIRECTS