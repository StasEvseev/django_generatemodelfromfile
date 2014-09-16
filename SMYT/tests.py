import string
import random

from datetime import date

from django.test import TestCase

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


class ModelsTestCase(TestCase):
    COUNT = 10

    def setUp(self):
        self.models_data = {}
        for sch_mdl in SCHEME_MODELS:
            for x in xrange(ModelsTestCase.COUNT):
                data = {}
                fiels = SCHEME_MODELS.get(sch_mdl)['fields']
                for fld in fiels:
                    data[fld['id']] = generate_data(fld['type'])
                Model = MODELS.get(sch_mdl)
                if x == 0:
                    self.models_data[sch_mdl] = data

                Model.objects.create(**data)

    def get_models_data(self, model):
        return self.models_data[model]

    def test_models_count(self):
        for sch_mdl in SCHEME_MODELS:
            self.assertEqual(MODELS.get(sch_mdl).objects.count(), ModelsTestCase.COUNT)

    def test_query(self):
        for sch_mdl in SCHEME_MODELS:
            Model = MODELS.get(sch_mdl)
            data = self.get_models_data(sch_mdl)
            self.assertIsNotNone(Model.objects.filter(**data))