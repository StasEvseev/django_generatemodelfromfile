import json
import string
import random

from datetime import date

from django.test import TestCase, Client
from django.core.urlresolvers import reverse

from SMYT.models import MODELS, SCHEME_MODELS


def generate_int():
    return random.randint(1, 100)


def generate_str(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def generate_date():
    start_date = date.today().replace(day=1, month=1).toordinal()
    end_date = date.today().toordinal()
    return date.fromordinal(random.randint(start_date, end_date))


def generate_data(type):
    return {
        'char': generate_str,
        'int': generate_int,
        'date': generate_date
    }[type]()


def generate_data_to_model(mdl):
    data = {}
    fiels = SCHEME_MODELS.get(mdl)['fields']
    for fld in fiels:
        data[fld['id']] = generate_data(fld['type'])
    return data


class ModelsTestCase(TestCase):
    COUNT = 10

    def setUp(self):
        self.client = Client()
        for sch_mdl in SCHEME_MODELS:
            for x in xrange(ModelsTestCase.COUNT):
                data = generate_data_to_model(sch_mdl)
                Model = MODELS.get(sch_mdl)
                Model.objects.create(**data)

    def test_models_count(self):
        for sch_mdl in SCHEME_MODELS:
            self.assertEqual(MODELS.get(sch_mdl).objects.count(), ModelsTestCase.COUNT)

    def test_metadata(self):
        resp = self.client.get(reverse('scheme_all'))
        self.assertEqual(resp.status_code, 200)
        cont = resp.content
        meta = json.loads(cont)['meta']
        for mdl in meta:
            self.assertEqual(SCHEME_MODELS[mdl], meta[mdl])

    def test_get_model(self):
        for model in SCHEME_MODELS:
            resp = self.client.get(reverse('data_all', kwargs={'scheme': model}))
            self.assertEqual(resp.status_code, 200)
            records = json.loads(resp.content)['records']
            self.assertEqual(len(records), ModelsTestCase.COUNT)

    def test_post_model(self):
        for model in SCHEME_MODELS:
            Model = MODELS[model]
            intance = Model.objects.first()
            _id = intance.id

            new_data = generate_data_to_model(model)

            resp = self.client.post(path=reverse('record-save', kwargs={'scheme': model, 'obj_id': _id}),
                                    data=new_data)
            self.assertEqual(resp.status_code, 200)

            new_intance = Model.objects.get(id=_id)

            for fld in new_data:
                self.assertEqual(new_data[fld], new_intance.__dict__.get(fld))