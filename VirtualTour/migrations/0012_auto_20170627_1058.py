# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-06-27 10:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('VirtualTour', '0011_auto_20170618_1905'),
    ]

    operations = [
        migrations.AddField(
            model_name='general_path',
            name='pos1',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='general_path',
            name='pos2',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='general_path',
            name='pos3',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='general_path',
            name='pos4',
            field=models.IntegerField(default=0),
        ),
    ]
