# Generated by Django 3.2.12 on 2022-02-20 18:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('threads', '0004_rename_message_message_text'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='text',
        ),
    ]
