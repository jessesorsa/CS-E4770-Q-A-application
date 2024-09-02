from transformers import pipeline, set_seed

set_seed(32)

generator = pipeline(
    'text-generation', model="facebook/opt-125m", do_sample=True)
