import datetime
import json

from django.core.serializers.json import DjangoJSONEncoder
from django.http.response import HttpResponse
from django.shortcuts import render

from SMYT.models import MODELS, SCHEME_MODELS


def index(request):
    return render(request, 'index.html', {'models': SCHEME_MODELS})


def data_scheme_all(request, scheme):
    if request.method == "POST":
        Model = MODELS[scheme]
        Model(**_get_data_from_js(request.POST, scheme)).save()
        return HttpResponse()
    else:
        res = [_get_data(mdl, scheme) for mdl in MODELS[scheme].objects.all()]
        res = {'records': res,
               'meta': SCHEME_MODELS[scheme]}
        return HttpResponse(json.dumps(res, cls=DjangoJSONEncoder), content_type="application/json")


def record_save(request, scheme, obj_id):
    if request.method == "POST":
        Model = MODELS[scheme]
        instance = Model.objects.get(id=obj_id)
        data = _get_data_from_js(request.POST, scheme)
        instance.__dict__.update(data)
        instance.save()
        return HttpResponse()


def scheme_all(request):
    return HttpResponse(json.dumps({'meta': SCHEME_MODELS}, cls=DjangoJSONEncoder), content_type="application/json")


def _fill_data(sch, model):
    for fld in sch:
        sch[fld] = model[fld]


def _get_schema(schema):
    flds = SCHEME_MODELS[schema]['fields']
    res = {}
    for fld in flds:
        fld_name = fld['id']
        res[fld_name] = None
    return res


def _get_data_from_js(model, schema):
    flds = SCHEME_MODELS[schema]['fields']
    res = {}
    for fld in flds:
        fld_name = fld['id']
        if fld['type'] == 'date':
            value = datetime.datetime.strptime(model[fld_name], "%Y-%m-%d")
        else:
            value = model[fld_name]

        res[fld_name] = value
    return res


def _get_data(model, schema):
    flds = SCHEME_MODELS[schema]['fields']
    res = {}

    for fld in flds:
        fld_name = fld['id']
        res[fld_name] = getattr(model, fld_name, None)
    res.update({'id': model.id})

    return res