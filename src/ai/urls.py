from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from . import views

router = routers.DefaultRouter()

urlpatterns = [
    path('v1/', include(router.urls)),
    path('v1/tickets/', views.TicketList.as_view()),
    path('v1/auth', obtain_auth_token, name='api_token_auth'),
]
