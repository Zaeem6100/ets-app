from flask import Flask, jsonify, request
import DatabaseHelper as db

from retinaface import RetinaFace
from deepface import DeepFace

app = Flask(__name__)


def faceEmbeddings(img):
    return RetinaFace.extract_faces(img, align=True)


def verifyFace(img1, img2):
    embeddings1 = faceEmbeddings(img1)
    embeddings2 = faceEmbeddings(img2)
    if embeddings1 is None or embeddings2 is None:
        return False
    else:
        return DeepFace.verify(img1_path=embeddings1[0], img2_path=embeddings2[0], model_name='Facenet512')


@app.route('/verify', methods=['POST'])
def verifyImage():
    if request.method == 'POST':
        if request.files:
            image = request.files["image"]
            id = request.json["id"]
            path = request.json["path"]
            # todo create a share directory for the images
            if id and path:
                image = faceEmbeddings(image)
                name, embedding = db.getData(id)
                if name is None and embedding is None:
                    return jsonify({'error': 'User not registered', 'errorCode': 1})
                else:
                    return jsonify(verifyFace(embedding, image))


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        if request.files:
            image = request.files["image"]
            id = request.json["id"]
            if id:
                embeddings = faceEmbeddings(image)
                if len(embeddings) == 0:
                    return jsonify({'error': 'No faces found', 'errorCode': 2})
                else:
                    embedding = embeddings[0]
                    db.insertdata(id, embedding)
                    return jsonify({'success': 'User registered'})


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'})
    # return jsonify(verifyface('img1.png', 'img2.png'))


if __name__ == '__main__':
    app.run()
