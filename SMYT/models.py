import os
import yaml

from django.db import models

from SMYT import classfactory

def init_models():
    NAME = os.path.dirname(__file__) + "/scheme.yaml"
    modelsscheme = yaml.load(open(NAME).read())

    models = []

    for model in modelsscheme:
        models.append(classfactory(model, modelsscheme[model]))
    return models


class A(models.Model):
    name = models.CharField("bla", max_length=50)


MODELS = init_models()