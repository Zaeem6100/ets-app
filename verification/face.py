import logging
from pathlib import Path

import numpy as np
from deepface import DeepFace

logger = logging.getLogger('Face')


class Face:
    # returns 128d vector embedding
    @staticmethod
    def get_embedding(image):
        try:
            return DeepFace.represent(
                image,
                model_name='Facenet',
                enforce_detection=True,
                detector_backend='mtcnn'
            )
        except ValueError:
            logger.error(f"Value error from Deepface for image: {image}")

    @staticmethod
    def extract_embeddings(images, unlink=True):
        embeddings = []
        for image in images:
            embeddings.append(Face.get_embedding(image))
            if unlink:
                Path(image).unlink(missing_ok=True)
        return embeddings

    @staticmethod
    def verify(source, target):
        threshold = 0.4

        # cosine distance
        a = np.matmul(np.transpose(source), target)
        b = np.sum(np.multiply(source, source))
        c = np.sum(np.multiply(target, target))

        distance = np.float64((1 - (a / (np.sqrt(b) * np.sqrt(c)))))
        return distance <= threshold

    @staticmethod
    def verify_embeddings(image, embeddings):
        source = Face.get_embedding(image)

        flag = False
        for embedding in embeddings:
            flag = flag or Face.verify(source, embedding)

        return flag
