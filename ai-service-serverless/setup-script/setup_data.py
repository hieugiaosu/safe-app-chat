from modal import App, Image, Volume
image = (
    Image.debian_slim("3.11")
    .pip_install("gdown", "pandas", "numpy")
    .run_commands(
        "gdown --fuzzy https://drive.google.com/file/d/1CyrKX4BxYGlWJ62_ahzd04NVUDjsvftF/view?usp=sharing -O train.csv",
        "gdown --fuzzy https://drive.google.com/file/d/1j_SZc3693BhboJEaF1txT5bynCDi1kXz/view?usp=sharing -O test.csv",
        "gdown --fuzzy https://drive.google.com/file/d/1-2eF65DpBKWcpYg0qvWrzUmKa4nUhifU/view?usp=sharing -O vocab.json",
        )
)

volume = Volume.from_name("httm-btl", create_if_missing=True)

app = App()

@app.function(image=image, gpu=None, volumes={"/model": volume})
def setup_data():
    import os
    import shutil
    import pandas as pd
    import numpy as np
    import json


    os.makedirs('/model/data', exist_ok=True)
    shutil.move('../train.csv', '/model/data/train.csv')
    shutil.move('../test.csv', '/model/data/test.csv')
    shutil.move('../vocab.json', '/model/data/vocab.json')

    with open('/model/data/vocab.json', 'r') as f:
        vocab = json.load(f)
    
    train_doc = pd.read_csv('/model/data/train.csv')
    train_doc = train_doc['content'].values

    train_doc = list(map(lambda x: eval(x) if isinstance(x,str) else x, train_doc))

    vocab_index = {word: idx for idx, word in enumerate(vocab)}

    total_doc = len(train_doc)

    idf = {word:0 for word in vocab}
    for doc in train_doc:
        content = list(map(lambda x: "__UNSEEN__" if x not in vocab_index.keys() else x, doc))
        for word in set(content):
            idf[word] += 1
    
    for word in idf.keys():
        idf[word] = np.log2(1+total_doc / idf[word])

    with open('/model/data/idf.json', 'w') as f:
        json.dump(idf, f)
    
    with open('/model/data/vocab_index.json', 'w') as f:
        json.dump(vocab_index, f)
    
    volume.commit()

if __name__ == '__main__':
    setup_data.remote()