# Generated by Django 5.1.2 on 2024-12-13 05:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('producto', '0003_producto_fotografia'),
    ]

    operations = [
        migrations.AddField(
            model_name='producto',
            name='precio',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=8),
            preserve_default=False,
        ),
    ]