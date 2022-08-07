from deepface import DeepFace

from db import DB

if __name__ == "__main__":
    DB.ensure_creation()
    DeepFace.Facenet.loadModel()
