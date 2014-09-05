from SMYT.helpers import classfactory, import_models


def init_models(models):
    mdls = {}
    for model in models:
        mdls[model] = (classfactory(model, models[model]))
    return mdls

SCHEME_MODELS = import_models()
MODELS = init_models(SCHEME_MODELS)