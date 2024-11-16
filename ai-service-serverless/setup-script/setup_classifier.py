from modal import App, Image, Volume
image = (
    Image.debian_slim("3.11")
    .pip_install("gdown")
    .run_commands(
        "gdown --fuzzy https://drive.google.com/file/d/1RnK4qV-gOuT6PB3IlX0EHKUT1u2tQp8V/view?usp=sharing -O pipeline.joblib",
        )
)

volume = Volume.from_name("httm-btl", create_if_missing=True)

app = App()

@app.function(image=image, gpu=None, volumes={"/model": volume})
def setup_classifier():
    import os
    import shutil

    os.makedirs('/model/classifier', exist_ok=True)
    shutil.move('../pipeline.joblib', '/model/classifier/pipeline.joblib')
    volume.commit()

if __name__ == '__main__':
    setup_classifier.remote()