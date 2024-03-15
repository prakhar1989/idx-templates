#!/bin/sh
source .venv/bin/activate
uvicorn main:app --reload --port $PORT
