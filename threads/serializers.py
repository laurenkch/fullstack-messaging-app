from django.contrib.auth.models import User
from site import USER_BASE
from rest_framework import serializers
from .models import Thread, Message
from django.conf import settings


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ('id','name')


class MessageSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Message
        fields = ('id','user', 'text', 'thread', 'username')

