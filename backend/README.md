First of all the libraries and the model has to be downloaded before launching the backend in `app.py`

To install the libraries use the command `pip install -r requirements.txt`

To download the model run `python dowload_model.py` here I download gpt2 cause of the low computation power provided by the cpu

Then run the backend by using the command `uvicorn app:app`