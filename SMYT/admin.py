from django.contrib import admin

from SMYT.helpers import adminfactory
from SMYT.models import MODELS


def init_admin():
    for model in MODELS:
        admin.site.register(MODELS[model], adminfactory(MODELS[model]._meta.model_name + "Admin", {}))

init_admin()