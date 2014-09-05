import os
import yaml

from django.contrib.admin import ModelAdmin
from django.db.models.base import ModelBase
from django.db import models as mdl
from django.forms import MediaDefiningClass

import django.db.models.fields as fld


def classfactory(name, dict_):

    assert dict_.has_key('fields'), "ALERT FIELDS"
    assert dict_.has_key('title'), "ALERT TITLE"

    attrs = dict([fieldfactory(fl) for fl in dict_['fields']])
    attrs['__module__'] = 'SMYT.models'
    attrs['Meta'] = type('Meta', (), {'verbose_name': dict_['title']})

    return ModelBase(name, (mdl.Model, ), attrs)

def fieldfactory(dict_):
    assert dict_.has_key('type'), "ALERT TYPE"
    assert dict_.has_key('id'), "ALERT ID"
    assert dict_.has_key('title'), "ALERT TITLE"

    fldcl = {
        'char': fld.CharField,
        'int': fld.IntegerField,
        'date': fld.DateField
    }[dict_['type']]

    atts = {'max_length': 100} if dict_['type'] == 'char' else {}

    return dict_['id'], fldcl(verbose_name=dict_['title'], **atts)


def adminfactory(name, attrs):
    return MediaDefiningClass(name, (ModelAdmin, ), attrs)


def import_models():
    NAME = os.path.dirname(__file__) + "/scheme.yaml"
    modelsscheme = yaml.load(open(NAME).read())

    models = {}

    for model in modelsscheme:
        models[model] = modelsscheme[model]
    return models