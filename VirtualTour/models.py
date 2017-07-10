from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.
# class show_im(models.Model):

class images(models.Model):
    impath=models.CharField(max_length=100, default='')
    name=models.CharField(max_length=100, default='')
    lat=models.DecimalField(max_digits=10, decimal_places=6)
    lon=models.DecimalField(max_digits=10, decimal_places=6)
    def __str__(self):
        return str(self.pk)+" - "+str(self.name)

class images_graph (models.Model):
    node_a = models.ForeignKey('images',null=True,related_name='node_a')
    node_b = models.ForeignKey('images',null=True,related_name='node_b')
    def __str__(self):
        return str(self.node_a.name)+" - "+str(self.node_b.name)

class general_path(models.Model):
    heading  = models.ForeignKey('images',null=True,related_name='heading')
    title= models.CharField(max_length=200, default='')
    descrp = models.TextField( max_length=200000 )
    qty = models.IntegerField(default=0,validators=[MaxValueValidator(2), MinValueValidator(0)])
    pos1 = models.IntegerField(default=0)
    pos2= models.IntegerField(default=0)
    pos3= models.IntegerField(default=0)
    pos4= models.IntegerField(default=0)
    def __str__(self):
        return str(self.heading.name)+"-"+str(self.descrp)+"-"+str(self.qty)

