from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'bio']
        read_only_fields = ['id']

class UserUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'avatar', 'bio', 'current_password', 'new_password']
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False}
        }

    def validate(self, data):
        if 'new_password' in data and not data.get('current_password'):
            raise serializers.ValidationError(
                {"current_password": "Current password is required to set new password"}
            )
        return data

    def update(self, instance, validated_data):
        current_password = validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)

        if new_password:
            if not instance.check_password(current_password):
                raise serializers.ValidationError(
                    {"current_password": "Wrong password"}
                )
            instance.set_password(new_password)

        return super().update(instance, validated_data)
