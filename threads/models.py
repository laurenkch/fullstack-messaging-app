from django.db import models
from django.conf import settings


class Thread (models.Model):
    name = models.CharField(max_length = 255, null = True)

    def __str__(self):
        return(self.name)
    
class Message (models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, null=True)
    text = models.TextField(null=True)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return(self.text)
