from sqlalchemy import create_engine, text
from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud.sql.connector import Connector, IPTypes
import pymysql
import os
import hashlib

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\user\OneDrive\Desktop\Database\final_project\housing_dataset\cs411final-476322-f06608fe38c5.json"
credentials_path=os.path.join(os.path.dirname(__file__), "cs411final-476322-f06608fe38c5.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
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

@app.route("/houses", methods=["GET"])
def get_houses_example():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM House LIMIT 1"))
        rows = [dict(row._mapping) for row in result]
        return jsonify(rows)

@app.route("/add", methods=["POST"])
def add_data():
    new_item = request.json
    user_name = new_item["user_name"]

    # --- Step 1: generate prefix from user_name ---
    # For example: "Andrew Liu" -> "al", "Samantha" -> "sa"
    parts = user_name.split()
    if len(parts) >= 2:
        prefix = parts[0][0].lower() + parts[1][0].lower()
    else:
        prefix = user_name[:2].lower()  # fallback if only one word

    with engine.connect() as conn:
        # --- Step 2: find existing count ---
        result = conn.execute(
            text("SELECT COUNT(*) FROM User WHERE user_id LIKE :prefix"),
            {"prefix": f"{prefix}%"}
        )
        count = result.scalar() or 0  # number of existing users with same prefix

        # --- Step 3: assign next user_id ---
        user_id = f"{prefix}{count+1}"

        # --- Step 4: hash the password ---
        raw_password = new_item["user_password"].encode("utf-8")
        hashed_password = hashlib.sha1(raw_password).hexdigest()  # 40-char SHA-1

        # --- Step 5: insert into database ---
        conn.execute(
            text(
                """INSERT INTO User (user_name, user_id, user_password)
                   VALUES (:user_name, :user_id, :user_password)"""
            ),
            {
                "user_name": user_name,
                "user_id": user_id,
                "user_password": hashed_password,
            }
        )
        conn.commit()

    return jsonify({"status": "success", "user_id": user_id})

if __name__ == "__main__":
    app.run(debug=False)