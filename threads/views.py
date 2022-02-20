
from rest_framework import generics
from .models import Thread, Message
from .serializers import MessageSerializer, ThreadSerializer

class ThreadListAPIView(generics.ListCreateAPIView):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer

class ThreadDetail(generics.ListCreateAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        '''
        this view should return a list of all messages associated with a paritcular thread
        '''

        thread = self.kwargs['thread']
        return Message.objects.filter(thread = thread)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MessageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


