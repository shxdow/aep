"""
    This module contains the various endpoints
"""

from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

urlpatterns = [
    path('v1/', include(router.urls)),
    path('v1/auth/', views.auth),
    path('v1/signup/', views.signup),
    path('v1/operator/add/', views.add_operator),
    path('v1/operator/<int:pk>/', views.handle_operator),
    path('v1/client/add/', views.add_client),
    path('v1/client/<int:pk>/', views.handle_client),
    path('v1/group/add/', views.add_group),
    path('v1/group/<int:pk>/', views.handle_group),
    #  path('v1/ticket/add/', views.add_ticket),
    #  path('v1/ticket/<int:pk>/', views.handle_ticket),
]
