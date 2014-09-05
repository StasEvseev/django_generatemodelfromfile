import json
from django.core.serializers.json import DjangoJSONEncoder

from django.http.response import HttpResponse
from django.shortcuts import render, get_object_or_404

from SMYT.models import MODELS, SCHEME_MODELS


def index(request):
    return render(request, 'index.html', {'models': SCHEME_MODELS})


def data_all(request, model):
    return data(request, model, None)


def data(request, model, obj_id):
    if obj_id is None:
        res = [_get_data(mdl, model) for mdl in MODELS[model].objects.all()]
    else:
        res = _get_data(
            get_object_or_404(MODELS[model], pk=obj_id), model)
    return HttpResponse(json.dumps(res, cls=DjangoJSONEncoder), content_type="application/json")


def _get_data(model, schema):
    flds = SCHEME_MODELS[schema]['fields']
    res = {}

    for fld in flds:
        fld_name = fld['id']
        res[fld_name] = getattr(model, fld_name, None)
    res.update({'id': model.id})

    return res