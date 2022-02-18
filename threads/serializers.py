from rest_framework import serializers
from .models import Thread, Message


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ('id','name')


class MessageSerializer(serializers.ModelSerializer):
    # username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Message
        fields = ('id','user', 'message', 'thread')