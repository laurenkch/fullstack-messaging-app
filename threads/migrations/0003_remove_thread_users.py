# Generated by Django 3.2.12 on 2022-02-18 16:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('threads', '0002_auto_20220218_1639'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='thread',
            name='users',
        ),
    ]