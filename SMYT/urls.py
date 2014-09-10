from django.conf.urls import patterns, url

from SMYT import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    #url(r'^(?P<model>\w+)/$', views.data_all, name='data_all'),
    #url(r'^(?P<model>\w+)/(?P<obj_id>\d+)$', views.data, name='data'),
    url(r'^scheme_all/$', views.scheme_all, name='scheme_all'),
    url(r'^(?P<scheme>\w+)/$', views.data_scheme_all, name='data_all'),
    url(r'^(?P<scheme>\w+)/(?P<obj_id>\d+)$', views.record_save, name='record-save'),
)