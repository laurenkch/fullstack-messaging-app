from django.urls import path
from .views import ThreadListAPIView, MessageDetail, ThreadDetail

app_name = 'threads'

urlpatterns = [
    path("<int:thread>/messages/<int:pk>", MessageDetail.as_view(), name="message_detail"),
    path("<int:thread>/messages/", ThreadDetail.as_view(), name='thread_messages'),
    path('', ThreadListAPIView.as_view(), name='thread_list')
]

