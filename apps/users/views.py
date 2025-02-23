from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import User
from .serializers import UserSerializer, UserUpdateSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'update' or self.action == 'partial_update':
            return UserUpdateSerializer
        return UserSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')
        if pk == "me":
            return self.request.user
        return super().get_object()

    @action(detail=False)
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=False, methods=['post'])
    def update_mood(self, request):
        user = request.user
        mood = request.data.get('mood')
        if mood in dict(User.MOOD_CHOICES).keys():
            user.current_mood = mood
            user.save()
            return Response({'status': 'mood updated'})
        return Response({'error': 'invalid mood'}, status=status.HTTP_400_BAD_REQUEST)
