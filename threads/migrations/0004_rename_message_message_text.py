# Generated by Django 3.2.12 on 2022-02-20 18:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('threads', '0003_remove_thread_users'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='message',
            new_name='text',
        ),
    ]
