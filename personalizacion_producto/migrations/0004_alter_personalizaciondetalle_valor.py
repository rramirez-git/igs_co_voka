# Generated by Django 5.1.2 on 2024-12-13 05:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('personalizacion_producto', '0003_alter_personalizacion_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personalizaciondetalle',
            name='valor',
            field=models.TextField(blank=True, default=''),
        ),
    ]