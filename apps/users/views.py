from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserUpdateSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def update_mood(self, request):
        user = request.user
        mood = request.data.get('mood')
        if mood in dict(User.MOOD_CHOICES).keys():
            user.current_mood = mood
            user.save()
            return Response({'status': 'mood updated'})
        return Response({'error': 'invalid mood'}, status=status.HTTP_400_BAD_REQUEST)
