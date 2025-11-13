from sqlalchemy import create_engine, text
from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud.sql.connector import Connector, IPTypes
import pymysql
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\user\OneDrive\Desktop\Database\final_project\housing_dataset\cs411final-476322-f06608fe38c5.json"

app = Flask(__name__)
CORS(app)

USER = 'root'
PASSWORD = 'CS411SQLHeavy!'
PUBLIC_IP = '136.114.180.112'
DATABASE_NAME = 'RobinSpot'
INSTANCE_CONNECTION_NAME  = 'cs411final-476322:us-central1:cs411sqlheavy'

connector = Connector(ip_type=IPTypes.PUBLIC)

def getconn():
    conn: pymysql.connections.Connection = connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pymysql",
        user=USER,
        password=PASSWORD,
        db=DATABASE_NAME
    )
    return conn

# engine = create_engine(f"mysql+pymysql://{USER}:{PASSWORD}@{PUBLIC_IP}/{DATABASE_NAME}")
engine = create_engine(
    "mysql+pymysql://",
    creator=getconn
)

@app.route("/data", methods=["GET"])
def get_data():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT user_name FROM User WHERE user_id=123 and user_password='tina123';"))
        rows = []
        for row in result:
            rows.append(dict(row._mapping))
    return jsonify(rows)

@app.route("/add", methods=["POST"])
def add_data():
    new_item = request.json
    with engine.connect() as conn:
        conn.execute(
            text(
                """INSERT INTO User (user_name, user_id, user_password) VALUES (:user_name, :user_id, :user_password)"""
            ),
            {
                "user_name":new_item["user_name"],
                "user_id":new_item["user_id"],
                "user_password":new_item["user_password"]
            }
        )
        conn.commit()
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(debug=True)