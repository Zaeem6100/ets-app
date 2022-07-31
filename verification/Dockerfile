FROM python:3.8

WORKDIR /app
RUN apt-get update -y
RUN apt-get install ffmpeg libsm6 libxext6 -y

COPY requirements.txt .
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .
EXPOSE 3001

CMD gunicorn --bind 0.0.0.0:3001 app:app
