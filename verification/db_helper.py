import sqlite3 as sql

db_path = './data/database.db'


def create_database():
    try:
        sqlite_connection = sql.connect(db_path)
        qry = '''create  table  Data (id varchar(255) primary key , img blob );'''
        cursor = sqlite_connection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(qry)
        sqlite_connection.commit()
        print("SQLite table created")
        cursor.close()
        sqlite_connection.close()
    except sql.Error as e:
        print(f"Error :  {e} ")


def convert_to_binary_data(img):
    # Convert digital data to binary format
    with open(img, 'rb') as file:
        blob_data = file.read()
    return blob_data


def write_to_file(data, filename):
    # Convert binary data to proper format and write it on Hard Disk
    with open(filename, 'wb') as file:
        file.write(data)
    print("Stored blob data into: ", filename, "\n")


def insert_data(id, img):
    try:
        sqlite_connection = sql.connect(db_path)
        cursor = sqlite_connection.cursor()
        print("Connected to SQLite")
        qry = ''''INSERT INTO Data (id,img) values (?,?);'''
        # img = convertToBinaryData(img)
        data = (id, img)
        cursor.execute(qry, data)
        sqlite_connection.commit()
        sqlite_connection.close()
    except sql.Error as e:
        print(f"Error :  {e} ")


def get_data(id):
    try:
        sqlite_connection = sql.connect(db_path)
        cursor = sqlite_connection.cursor()
        print("Connected to SQLite")
        qry = '''SELECT * FROM Data WHERE id = ?;'''
        data = id
        cursor.execute(qry, data)
        result = cursor.fetchall()
        sqlite_connection.close()
        if result is None:
            return None, None
        return result
    except sql.Error as e:
        print(f"Error :  {e} ")
