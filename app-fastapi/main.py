from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from typing import Optional

from src.assets.strategies.json_manifest_strategy import get_asset

app = FastAPI()
templates = Jinja2Templates(directory="templates")
templates.env.globals['assets'] = get_asset


@app.get("/", response_class=HTMLResponse)
async def get_root(request: Request):
    return templates.TemplateResponse("default/index.html.jinja2", {
        "request": request
    })

@app.get("/api/hello")
def get_api_hello():
    return {"Hello": "World"}
