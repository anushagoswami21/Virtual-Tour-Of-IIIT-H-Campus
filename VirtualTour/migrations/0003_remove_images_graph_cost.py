# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-06-13 09:37
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('VirtualTour', '0002_images_graph'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='images_graph',
            name='cost',
        ),
    ]