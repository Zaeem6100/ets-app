import logging
import os

from celery import Celery
from flask import Flask, jsonify, request

from db import DB
from face import Face

app = Flask(__name__)

logger = logging.getLogger('Verifier')
logger.setLevel("DEBUG")

redis_host = os.getenv("REDIS_HOST", default="localhost")
node_host = os.getenv("NODE_HOST", default="localhost")

celery = Celery(app.name, broker=f"redis://{redis_host}:6379/0")


@app.route('/verify', methods=['POST'])
def verify_image():
    if request.method != 'POST':
        return "Not Allowed", 405

    id: str = request.json["id"]
    image = request.json["image"]
    if not id or not image:
        return "Bad Request", 400

    verify_faces_task.delay(id, image)
    return jsonify(success=True)


@app.route('/register', methods=['POST'])
def register():
    if request.method != 'POST':
        return "Not Allowed", 405

    images = request.json["images"]
    id: str = request.json["id"]
    if not id or not images:
        return "Bad Request", 400

    register_faces_task.delay(id, images)
    return jsonify(success=True)


@app.errorhandler(404)
def not_found():
    return "Not Found", 404


@celery.task(bind=True)
def verify_faces_task(id, image):
    embeddings = DB().get_embeddings(id)
    if len(embeddings) != 0:
        verify = Face.verify_embeddings(image, embeddings)
        # TODO: respond to node server


@celery.task(bind=True)
def register_faces_task(id, images):
    embeddings = Face.extract_embeddings(images)
    if len(embeddings) != 0:
        DB().insert_embeddings(id, embeddings)


if __name__ == '__main__':
    DB.ensure_creation()
    app.run(host='0.0.0.0', port=3001)
