from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'SMYTtest.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^smyt/', include('SMYT.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
