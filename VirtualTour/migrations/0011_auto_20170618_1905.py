# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-06-18 19:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('VirtualTour', '0010_auto_20170618_1901'),
    ]

    operations = [
        migrations.AlterField(
            model_name='general_path',
            name='descrp',
            field=models.TextField(max_length=200000),
        ),
    ]