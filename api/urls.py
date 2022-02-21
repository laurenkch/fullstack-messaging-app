from django.urls import path, include

app_name = 'api'

urlpatterns = [
    path('threads/', include('threads.urls', namespace = 'threads')),
]


