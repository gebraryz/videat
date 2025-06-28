from fastapi import FastAPI
from pydantic import BaseModel
import fasttext
import os
import urllib.request

MODEL_PATH = "/app/model_cache/lid.176.bin"
MODEL_URL = "https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.bin"

if not os.path.isfile(MODEL_PATH):
    print("Model not found locally. Downloading...")

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    
    print("Download completed.")

model = fasttext.load_model(MODEL_PATH)
app = FastAPI()

class TextPayload(BaseModel):
    value: str

@app.post("/detect-language")
def detect_language(data: TextPayload):
    text = data.value.replace('\n', ' ').strip()
    prediction = model.predict(text)

    label = prediction[0][0].replace("__label__", "")
    confidence = float(prediction[1][0])

    language = label.split("-")[0]

    return {"language": language, "confidence": confidence}

