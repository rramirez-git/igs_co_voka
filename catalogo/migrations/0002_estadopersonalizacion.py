# Generated by Django 5.1.2 on 2024-12-12 20:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalogo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EstadoPersonalizacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estado', models.CharField(max_length=200)),
                ('estado_interno', models.CharField(blank=True, default='', max_length=100)),
            ],
            options={
                'ordering': ['estado', 'estado_interno'],
            },
        ),
    ]
