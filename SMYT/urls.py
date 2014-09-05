from django.conf.urls import patterns, url

from SMYT import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^(?P<model>\w+)/$', views.data_all, name='data_all'),
    url(r'^(?P<model>\w+)/(?P<obj_id>\d+)$', views.data, name='data'),
)