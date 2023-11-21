import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pyowm import OWM
from langchain.llms import CTransformers
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from pydantic import BaseModel

class Message(BaseModel):
    text: str

template = """You are a helpful AI assistant: {question}.
             """
prompt = PromptTemplate(template=template, input_variables=["question"])
llm = CTransformers(model="ggml-model.bin", model_type='gpt2')
llm_chain = LLMChain(prompt=prompt, llm=llm, verbose=True)


load_dotenv()

openWeatherMapAPIKey = os.getenv("OpenWeatherMapAPIKey")
owm = OWM(openWeatherMapAPIKey)
mgr = owm.weather_manager()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get-weather/{location}")
async def get_weather(location: str):
    try:
        observation = mgr.weather_at_place(location)
        w = observation.weather
        result = {
            "location": f"{observation.location.name}, {observation.location.country}",
            "status": w.status,
            "description": w.detailed_status,
            "temperature": w.temperature("celsius")["temp"],
            "wind": w.wind()["speed"],
            "humidity": w.humidity,
            "clouds": w.clouds,
        }
        return result
    except:
        result = {
            "location": "Not Found",
            "status": "-",
            "description": "-",
            "temperature": "-",
            "wind": "-",
            "humidity": "-",
            "clouds": "-",
        }
        return result
    
@app.get("/suggest-activity/{location}")
async def suggest_activity(location: str):
    try:
        print(location)
        observation = mgr.weather_at_place(location)
        w = observation.weather
        detailed_status = w.detailed_status
        query = f"What is a good activity in {location} if the weather is {detailed_status}?"
        res = llm_chain(query)
        text = res['text']
        text = text.strip().split('\n')[0]
        print(text)
        result = {
            "activity": text,
        }
        return result
    except:
        result = {
            "activity": "Not Found",
        }
        return result
    
@app.post("/respond")
async def respond(message: Message):
    try:
        print(message.text)
        query = message.text
        res = llm_chain(query)
        text = res['text']
        text = text.strip().split('\n')[0]
        print(text)
        result = {
            "text": text,
        }
        return result
    except:
        result = {
            "text": "Send me a message again",
        }
        return result