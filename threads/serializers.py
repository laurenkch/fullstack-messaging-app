from rest_framework import serializers
from .models import Thread, Message


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ('users', 'name')


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('user', 'message', 'thread')