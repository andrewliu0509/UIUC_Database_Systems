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

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user_name = data.get("user_name", "")
    raw_password = data.get("user_password", "")

    # Hash password the same way as signup
    hashed_password = hashlib.sha1(raw_password.encode("utf-8")).hexdigest()

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT user_id
                FROM User
                WHERE user_name = :user_name
                AND user_password = :user_password
            """),
            {
                "user_name": user_name,
                "user_password": hashed_password,
            }
        ).first()

        # count = result.scalar() or 0

    # Return user_id to save it in frontend
    # if count >= 1:
    #     return jsonify({"success": True, "user_id": result[0]})
    # else:
    #     return jsonify({"success": False})
    if result:
        return jsonify({"success": True, "user_id": result[0]})
    else:
        return jsonify({"success": False})

@app.route("/signup", methods=["POST"])
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

# Show reports that user with user_id reported
@app.route("/user_reports", methods=["GET"])
def get_user_reports():
    user_id = request.args.get("user_id")

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT *
                FROM User_Reporting
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        )
        rows = [dict(row._mapping) for row in result]
    return jsonify(rows)

# Insert a new report from user
@app.route("/user_reports", methods=["POST"])
def insert_user_reports():
    data = request.json
    user_id = data.get("user_id", "")
    location_keyword = data.get("location", "")
    property_type = data.get("property_type", "")
    sold_price = data.get("sold_price", "")
    list_price = data.get("list_price", "")
    list_time = data.get("list_time", "")
    sold_time = data.get("sold_time", "")
    square_feet = data.get("square_feet", "")

    if not [location_keyword, property_type, sold_price, list_price, list_time, sold_time, square_feet]:
        return jsonify({"status": "failed to insert due to lacking fields"})

    with engine.connect() as conn:
        # get region_id based on user's input (location)
        result = conn.execute(
            text("""
                SELECT region_id
                FROM Location
                WHERE city LIKE :location_keyword 
                 or us_state LIKE :location_keyword 
                 or parent_metro_region LIKE :location_keyword
            """),
            {"location_keyword": f"%{location_keyword}%"}
        ).fetchone()
        region_id = result.region_id

        # get next report_id based on existing count
        result = conn.execute(
            text("SELECT MAX(report_id) FROM User_Reporting")
        )
        count = result.scalar() or 0
        report_id = count + 1

        # insert new report
        conn.execute(
            text("""
                INSERT INTO User_Reporting (report_id, user_id, region_id, property_type, sold_price, list_price, list_time, sold_time, square_feet)
                VALUES (:report_id, :user_id, :region_id, :property_type, :sold_price, :list_price, :list_time, :sold_time, :square_feet)
            """),
            {
                "report_id": report_id,
                "user_id": user_id,
                "region_id": region_id,
                "property_type": property_type,
                "sold_price": sold_price,
                "list_price": list_price,
                "list_time": list_time,
                "sold_time": sold_time,
                "square_feet": square_feet
            }
        )
        conn.commit()

    return jsonify({"status": "successfully insert"})

# Update a new report from user
@app.route("/user_reports", methods=["PUT"])
def update_user_reports():
    data = request.json
    user_id = data.get("user_id", "")
    location_keyword = data.get("location", "")
    property_type = data.get("property_type", "")
    sold_price = data.get("sold_price", "")
    list_price = data.get("list_price", "")
    list_time = data.get("list_time", "")
    sold_time = data.get("sold_time", "")
    square_feet = data.get("square_feet", "")
    report_id = data.get("report_id", "")

    if not report_id:
        return jsonify({"status": "failed to update due to no report_id"})

    with engine.connect() as conn:
        #get original report
        original_report = conn.execute(
            text("""
                SELECT *
                FROM User_Reporting
                WHERE report_id = :report_id
            """),
            {"report_id": report_id}
        ).fetchone()
        if not original_report:
            return jsonify({"status": "report not found"})
        
        # update_fields = dict(original_report._mapping)

        # for field in ["user_id", "property_type", "sold_price", "list_price", "list_time", "sold_time", "square_feet"]:
        #     if field in data and data[field] not in [None, ""]:
        #         update_fields[field] = data[field]
        
        # user_id = update_fields["user_id"]
        # property_type = update_fields["property_type"]
        # sold_price = update_fields["sold_price"]
        # list_price = update_fields["list_price"]
        # list_time = update_fields["list_time"]
        # sold_time = update_fields["sold_time"]
        # square_feet = update_fields["square_feet"]
        # print(update_fields)
        # get region_id
        # location_keyword = data.get("location", "")
        # if location_keyword and location_keyword != "":
        result = conn.execute(
            text("""
                SELECT region_id
                FROM Location
                WHERE city LIKE :location_keyword 
                or us_state LIKE :location_keyword 
                or parent_metro_region LIKE :location_keyword
            """),
            {"location_keyword": f"%{location_keyword}%"}
        ).fetchone()
        #     if result:
        #         region_id = result._mapping["region_id"]
        #     else:
        #         region_id = original_report._mapping["region_id"]
        # else:
        #     region_id = original_report._mapping["region_id"]
        region_id = result.region_id
        # update report
        conn.execute(
            text("""
                UPDATE User_Reporting
                SET user_id = :user_id, 
                 region_id = :region_id, 
                 property_type = :property_type, 
                 sold_price = :sold_price, 
                 list_price = :list_price, 
                 list_time = :list_time, 
                 sold_time = :sold_time, 
                 square_feet = :square_feet
                WHERE report_id = :report_id
            """),
            {
                "report_id": report_id,
                "user_id": user_id,
                "region_id": region_id,
                "property_type": property_type,
                "sold_price": sold_price,
                "list_price": list_price,
                "list_time": list_time,
                "sold_time": sold_time,
                "square_feet": square_feet
            }
        )
        conn.commit()

    return jsonify({"status": "successfully update"})

# delete a report from user
@app.route("/user_reports", methods=["DELETE"])
def delete_user_reports():
    data = request.json
    report_id = data.get("report_id", "")

    with engine.connect() as conn:
        conn.execute(
            text("""
                DELETE FROM User_Reporting
                WHERE report_id IN :report_id
            """),
            {
                "report_id": tuple(report_id)
            }
        )
        conn.commit()

    return jsonify({"status": "successfully delete"})

if __name__ == "__main__":
    app.run(debug=False)