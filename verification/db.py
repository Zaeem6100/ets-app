import sqlite3 as sql
import logging

import numpy as np

logger = logging.getLogger('DB')


class DB:
    db_path = './data/database.db'

    def __init__(self):
        self.conn = sql.connect(DB.db_path)

    def __del__(self):
        self.conn.close()

    @staticmethod
    def ensure_creation():
        try:
            logger.debug("SQlite init")
            conn = sql.connect(DB.db_path)
            conn.cursor().execute(
                '''CREATE TABLE IF NOT EXISTS face_embeddings (id VARCHAR(13), embedding BLOB);'''
            ).close()
            conn.commit()
            conn.close()
        except sql.Error as e:
            logger.error(f"ensure_creation: ERR: {e}")

    def insert_embeddings(self, id, embeddings):
        data = []
        print(embeddings)

        for embedding in embeddings:
            data.append((id, np.array(embedding, np.float).tobytes()))

        try:
            self.conn.cursor(). \
                executemany('''INSERT INTO face_embeddings (id, embedding) values (?, ?);''', data). \
                close()
            self.conn.commit()
        except sql.Error as e:
            logger.error(f"insert_embeddings: ERR: {e}")

    def get_embeddings(self, id):
        try:
            records = self.conn.cursor(). \
                execute('''SELECT embedding FROM face_embeddings WHERE id=?;''', (id,)). \
                fetchall()
            return [np.frombuffer(x[0], dtype=np.float) for x in records]
        except sql.Error as e:
            logger.error(f"get_embeddings: ERR: {e}")
