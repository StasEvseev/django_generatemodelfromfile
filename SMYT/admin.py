from django.contrib import admin

# Register your models here.
from SMYT import adminfactory
from SMYT.models import A, MODELS


def init_admin():
    for model in MODELS:
        admin.site.register(model, adminfactory(model._meta.model_name + "Admin", {}))


class AAdmin(admin.ModelAdmin):
    pass

admin.site.register(A, AAdmin)
init_admin()