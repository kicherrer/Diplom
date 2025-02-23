"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse, JsonResponse
from rest_framework.routers import DefaultRouter
from apps.users.views import UserViewSet
from apps.chat.api.views import ChatViewSet
from apps.analytics.api.views import AnalyticsViewSet

def index(request):
    return JsonResponse({
        "status": "ok",
        "message": "Django API is running",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/",
            "health": "/health/"
        }
    })

def health_check(request):
    return HttpResponse("OK")

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'chat', ChatViewSet, basename='chat')
router.register(r'analytics', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('', index, name='index'),  # Добавляем корневой маршрут
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
    path('health/', health_check, name='health'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
