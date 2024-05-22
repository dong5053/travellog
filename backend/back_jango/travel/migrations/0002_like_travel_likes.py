# Generated by Django 4.2 on 2024-04-28 16:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('travel', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='travel.userdata')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='travel.travel')),
            ],
            options={
                'unique_together': {('name', 'post')},
            },
        ),
        migrations.AddField(
            model_name='travel',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='liked_posts', through='travel.Like', to='travel.userdata'),
        ),
    ]
