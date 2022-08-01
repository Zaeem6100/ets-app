import sqlite3 as sql
import logging

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
                '''CREATE TABLE IF NOT EXISTS face_embeddings (id VARCHAR(13) PRIMARY KEY, embedding BLOB);'''
            ).close()
            conn.commit()
            conn.close()
        except sql.Error as e:
            logger.error(f"ensure_creation: ERR: {e}")

    def insert_embeddings(self, id, embeddings):
        data = []
        for embedding in embeddings:
            data.append((id, embedding.tobytes()))

        try:
            self.conn.cursor(). \
                executemany('''INSERT INTO face_embeddings (id, img) values (?, ?);''', data). \
                close()
            self.conn.commit()
        except sql.Error as e:
            logger.error(f"insert_embeddings: ERR: {e}")

    def get_embeddings(self, id):
        try:
            return self.conn.cursor(). \
                execute('''SELECT * FROM face_embeddings WHERE id = ?;''', id). \
                fetchall()
        except sql.Error as e:
            logger.error(f"get_embeddings: ERR: {e}")
