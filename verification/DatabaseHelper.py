import sqlite3 as sql


def createDatabase():
    try:
        sqliteConnection = sql.connect('database.db')
        qry = '''create  table  Data (id varchar(255) primary key , img blob );'''
        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(qry)
        sqliteConnection.commit()
        print("SQLite table created")
        cursor.close()
    except  sql.Error as e:
        print(f"Error :  {e} ")
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            # print("sqlite connection is closed")


def convertToBinaryData(img):
    # Convert digital data to binary format
    with open(img, 'rb') as file:
        blobData = file.read()
    return blobData


def writeToFile(data, filename):
    # Convert binary data to proper format and write it on Hard Disk
    with open(filename, 'wb') as file:
        file.write(data)
    print("Stored blob data into: ", filename, "\n")


def insertData(id, img):
    try:
        sqliteConnection = sql.connect('database.db')
        cursor = sqliteConnection.cursor()
        print("Connected to SQLite")
        qry = ''''INSERT INTO Data (id,img) values (?,?);'''
        # img = convertToBinaryData(img)
        data = (id, img)
        cursor.execute(qry, data)
        sqliteConnection.commit()
    except  sql.Error as e:
        print(f"Error :  {e} ")
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            # print("sqlite connection is closed")


def getData(id):
    try:
        sqliteConnection = sql.connect('database.db')
        cursor = sqliteConnection.cursor()
        print("Connected to SQLite")
        qry = '''SELECT * FROM Data WHERE id = ?;'''
        data = (id)
        cursor.execute(qry, data)
        result = cursor.fetchall()
        if result is None:
            return None, None
        return result
    except  sql.Error as e:
        print(f"Error :  {e} ")
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            # print("sqlite connection is closed")
