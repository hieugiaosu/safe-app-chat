from modal import App, Image, Volume
image = (
    Image.debian_slim("3.11")
    .pip_install("py_vncorenlp", "gdown")
    .apt_install("default-jdk")
    .run_commands(
        "gdown --fuzzy https://drive.google.com/file/d/1cYfRsS8uZnEb0KVMDbUev0-LNfv2yoMW/view?usp=sharing -O models.zip",
        "gdown --fuzzy https://drive.google.com/file/d/1wNmCO1jfeUFRy6Pru6RKjhCB5UmFPcFw/view?usp=sharing -O VnCoreNLP-1.2.jar",
        )
)

volume = Volume.from_name("httm-btl", create_if_missing=True)

app = App()

@app.function(image=image, gpu=None, volumes={"/model": volume})
def setup_tokenizer():
    import py_vncorenlp
    import os
    import shutil
    import zipfile
    def unzip_file(zip_path, extract_path):
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
    os.makedirs('/model/tokenizer', exist_ok=True)
    os.makedirs('/model/tokenizer/models', exist_ok=True)
    shutil.move('../VnCoreNLP-1.2.jar', '/model/tokenizer/VnCoreNLP-1.2.jar')
    unzip_file('../models.zip', '/model/tokenizer/models')
    volume.commit()
    tokenize = py_vncorenlp.VnCoreNLP(save_dir='/model/tokenizer')
    print(tokenize.annotate_text("xin chào thế giới"))

if __name__ == '__main__':
    setup_tokenizer.remote()