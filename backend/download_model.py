import os
import urllib.request
import progressbar

pbar = None


def show_progress(block_num, block_size, total_size):
    global pbar
    if pbar is None:
        pbar = progressbar.ProgressBar(maxval=total_size)
        pbar.start()

    downloaded = block_num * block_size
    if downloaded < total_size:
        pbar.update(downloaded)
    else:
        pbar.finish()
        pbar = None


def download_file(file_link, filename):
    # Checks if the file already exists before downloading
    if not os.path.isfile(filename):
        urllib.request.urlretrieve(file_link, filename, show_progress)
        print("File downloaded successfully.")
    else:
        print("File already exists.")

# Dowloading GGML model from HuggingFace
ggml_model_path = "https://huggingface.co/marella/gpt-2-ggml/resolve/main/ggml-model.bin"
filename = "ggml-model.bin"

download_file(ggml_model_path, filename)