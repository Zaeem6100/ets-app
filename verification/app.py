from flask import Flask, jsonify, request
import db_helper as db

from retinaface import RetinaFace
from deepface import DeepFace

app = Flask(__name__)


def face_embeddings(img):
    return RetinaFace.extract_faces(img, align=True)


def verify_face(img1, img2):
    embeddings1 = face_embeddings(img1)
    embeddings2 = face_embeddings(img2)
    if embeddings1 is None or embeddings2 is None:
        return False
    else:
        return DeepFace.verify(img1_path=embeddings1[0], img2_path=embeddings2[0], model_name='Facenet512')


@app.route('/verify', methods=['POST'])
def verify_image():
    if request.method == 'POST':
        if request.files:
            image = request.files["image"]
            id = request.json["id"]
            path = request.json["path"]
            # todo create a share directory for the images
            if id and path:
                image = face_embeddings(image)
                name, embedding = db.get_data(id)
                if name is None and embedding is None:
                    return jsonify({'error': 'User not registered', 'errorCode': 1})
                else:
                    return jsonify(verify_face(embedding, image))


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        if request.files:
            image = request.files["image"]
            id = request.json["id"]
            if id:
                embeddings = face_embeddings(image)
                if len(embeddings) == 0:
                    return jsonify({'error': 'No faces found', 'errorCode': 2})
                else:
                    embedding = embeddings[0]
                    db.insert_data(id, embedding)
                    return jsonify({'success': 'User registered'})


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
