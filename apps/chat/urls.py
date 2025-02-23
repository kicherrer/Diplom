from django.urls import path
from .views import ChatRoomView, MessageView

urlpatterns = [
    path('rooms/', ChatRoomView.as_view({'get': 'list', 'post': 'create'})),
    path('rooms/<int:pk>/', ChatRoomView.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('rooms/<int:room_id>/messages/', MessageView.as_view({'get': 'list', 'post': 'create'})),
]
