FROM python:3.6-slim

COPY . .
RUN python3.6 -m pip install -r requirements.txt
EXPOSE $PORT
CMD exec gunicorn --bind :$PORT --workers 1  --threads 8 --timeout 0 app:app
