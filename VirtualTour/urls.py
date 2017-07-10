from django.conf.urls import include ,url
# from WebApp import settings
from . import views

urlpatterns = [
    url(r'^$', views.im1, name='main_page'),
    url(r'instructions',views.im4,name='guide'),
    url(r'student_tour', views.im2, name='student'),
    url(r'dignitory_tour', views.im3, name='dignitory'),
    url(r'Index1/$', views.Index, name='Index'),

]
