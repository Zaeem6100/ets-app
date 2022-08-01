import logging

from flask import Flask, jsonify, request

from db import DB
from face import Face

app = Flask(__name__)

logger = logging.getLogger('Verifier')
logger.setLevel("DEBUG")


@app.route('/verify', methods=['POST'])
def verify_image():
    if request.method != 'POST':
        return "Not Allowed", 405

    id: str = request.json["id"]
    image = request.json["image"]
    if not id or not image:
        return "Bad Request", 400

    db = DB()
    embeddings = db.get_embeddings(id)

    if len(embeddings) == 0:
        return "Face not registered", 400

    verify = Face.verify_embeddings(image, embeddings)
    return jsonify({verify})


@app.route('/register', methods=['POST'])
def register():
    if request.method != 'POST':
        return "Not Allowed", 405

    images = request.json["images"]
    id: str = request.json["id"]
    if not id or not images:
        return "Bad Request", 400

    embeddings = Face.extract_embeddings(images)

    if len(embeddings) == 0:
        return "no faces found", 400

    DB().insert_embeddings(id, embeddings)
    return jsonify(success=True)


@app.errorhandler(404)
def not_found():
    return "Not Found", 404


if __name__ == '__main__':
    DB.ensure_creation()
    app.run(host='0.0.0.0', port=3001)
