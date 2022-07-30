FROM python:3.8-alpine

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 3001

CMD gunicorn --bind 0.0.0.0:3001 app:app
