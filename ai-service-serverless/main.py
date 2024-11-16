from modal import App, Image, Volume, Secret
import modal
image = (
    Image.debian_slim("3.11")
    .pip_install("py_vncorenlp", "emoji==2.13.2", "numpy==1.26.4", "pandas==2.2.2", "scikit-learn==1.5.2", "flask")
    .apt_install("default-jdk")
)

volume = Volume.from_name("httm-btl", create_if_missing=True)
app = App("ai-service-serverless")

ROOT_PATH_MODEL = "/model"

@app.function(image=image, gpu=None, volumes={ROOT_PATH_MODEL: volume}, secrets=[Secret.from_name('httm-btl')])
@modal.wsgi_app()
def main():
    import os
    import json
    import joblib
    import numpy as np
    import pandas as pd
    import py_vncorenlp
    import re
    import emoji
    from flask import Flask, request, jsonify
    from functools import wraps

    web_app = Flask(__name__)
    API_KEY = os.environ['API_KEY']

    with open(f'{ROOT_PATH_MODEL}/data/vocab.json', 'r') as f:
        VOCAB = json.load(f)
    
    with open(f'{ROOT_PATH_MODEL}/data/idf.json', 'r') as f:
        IDF = json.load(f)
    
    with open(f'{ROOT_PATH_MODEL}/data/vocab_index.json', 'r') as f:
        VOCAB_INDEX = json.load(f)
    
    TOKENIZER = py_vncorenlp.VnCoreNLP(save_dir=f'{ROOT_PATH_MODEL}/tokenizer')
    PIPELINE = joblib.load(f'{ROOT_PATH_MODEL}/classifier/pipeline.joblib')

    def preprocess(s):
        try:
            s = emoji.replace_emoji(s, replace='')
            s = re.sub(r'[^\w\s]', '', s, flags=re.UNICODE)
            s = re.sub(r'\d+', '', s)
            s = s.strip().lower()
            s = [i['wordForm'] for i in (TOKENIZER.annotate_text(s))[0]]
            return s
        except:
            return None

    def tokenize(word):
        if word in VOCAB_INDEX.keys():
            return VOCAB_INDEX[word]
        else:
            return VOCAB_INDEX['__UNSEEN__']
        
    def vectorize(doc: str):
        return np.array([IDF[word] * (doc.count(word)/len(doc)) for word in VOCAB])
    
    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token or token.split()[1] != API_KEY:
                return jsonify({"error": "Unauthorized"}), 401
            return f(*args, **kwargs)
        return decorated

    @web_app.route('/message-classifier/toxic-classify', methods=['POST'])
    @token_required
    def toxic_classify():
        try:
            content = request.json['message']
            content = preprocess(content)
            if content is None:
                return {"error": "Can't process the content"}
            content = vectorize(content)
            content = content.reshape(1, -1)
            result = PIPELINE.predict(content)
            return {"toxic": bool(result[0])}
        except:
            return {"error": "Can't process the content"}
        
    @web_app.route('/health-check', methods=['GET'])
    @token_required
    def health_check():
        return {"status": "OK"}
    
    return web_app