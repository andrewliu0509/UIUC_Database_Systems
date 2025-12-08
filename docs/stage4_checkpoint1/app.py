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
    state = request.args.get("state")
    period_begin = request.args.get("period_begin")
    period_end = request.args.get("period_end")
    property_type = request.args.get("property_type")

    with engine.connect() as conn:
        result = conn.execute(text("""SELECT * 
                                   FROM House 
                                   NATURAL JOIN Location
                                   WHERE us_state = :state
                                   AND period_begin >= :period_begin
                                   AND period_end <= :period_end
                                   AND property_type = :property_type
                                   LIMIT 15"""),
                                   {
            "state": state,
            "period_begin": period_begin,
            "period_end": period_end,
            "property_type": property_type
        }
                                   )
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

    print(f"attempted to login user: {user_name}")
    if result:
        return jsonify({"success": True, "user_id": result[0]})
    else:
        return jsonify({"success": False})

@app.route("/signup", methods=["POST"])
def add_data():
    new_item = request.json
    user_name = new_item["user_name"]

    # For example: "Andrew Liu" -> "al", "Samantha" -> "sa"
    parts = user_name.split()
    if len(parts) >= 2:
        prefix = parts[0][0].lower() + parts[1][0].lower()
    else:
        prefix = user_name[:2].lower()  # fallback if only one word

    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT COUNT(*) FROM User WHERE user_id LIKE :prefix"),
            {"prefix": f"{prefix}%"}
        )
        count = result.scalar() or 0  # number of existing users with same prefix

        user_id = f"{prefix}{count+1}"

        raw_password = new_item["user_password"].encode("utf-8")
        hashed_password = hashlib.sha1(raw_password).hexdigest()  # 40-char SHA-1

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
    city = data.get("city", "")
    state = data.get("state", "")
    property_type = data.get("property_type", "")
    sold_price = data.get("sold_price", "")
    list_price = data.get("list_price", "")
    list_time = data.get("list_time", "")
    sold_time = data.get("sold_time", "")
    square_feet = data.get("square_feet", "")

    required = [city, state, property_type, sold_price, list_price, list_time, sold_time, square_feet]
    if any(field == "" for field in required):
        return jsonify({"status": "failed to insert due to lacking fields"})

    with engine.connect() as conn:
        # get region_id based on user's input (location)
        result = conn.execute(
            text("""
                SELECT region_id
                FROM Location
                WHERE city = :city 
                and us_state = :us_state 
            """),
            {
                "city": city,
                "us_state": state
            }
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
    city = data.get("city", "")
    state = data.get("state", "")
    property_type = data.get("property_type", "")
    sold_price = data.get("sold_price", "")
    list_price = data.get("list_price", "")
    list_time = data.get("list_time", "")
    sold_time = data.get("sold_time", "")
    square_feet = data.get("square_feet", "")
    report_id = data.get("report_id", "")

    if not report_id:
        return jsonify({"status": "failed to update due to no report_id"})
    required = [city, state, property_type, sold_price, list_price, list_time, sold_time, square_feet]
    if any(field == "" for field in required):
        return jsonify({"status": "failed to update due to lacking fields"})

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
        
        result = conn.execute(
            text("""
                SELECT region_id
                FROM Location
                WHERE city = :city 
                and us_state = :us_state
            """),
            {
                "city": city,
                "us_state": state
            }
        ).fetchone()
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

# Insert a new report from user with transaction
@app.route("/report_by_transaction", methods=["POST"])
def insert_under_transaction():
    data = request.json
    user_id = data.get("user_id", "")
    city = data.get("city", "")
    state = data.get("state", "")
    property_type = data.get("property_type", "")
    list_time = data.get("list_time", "")
    sold_time = data.get("sold_time", "")

    try:
        # Convert the price and area fields from string to float
        sold_price = float(data.get("sold_price", 0))
        list_price = float(data.get("list_price", 0))
        square_feet = float(data.get("square_feet", 0))
    except (ValueError, TypeError):
        # Handle cases where the string isn't a valid number (e.g., "abc")
        return jsonify({"status": "failed to insert: Sold Price, List Price, or Square Feet must be valid numbers."})

    required = [city, state, property_type, sold_price, list_price, list_time, sold_time, square_feet]
    if any(field == "" for field in required):
        return jsonify({"status": "failed to insert due to lacking fields"})

    with engine.connect() as conn:
        trans = conn.begin() 

        try:
            result = conn.execute(
                text("""
                    SELECT region_id
                    FROM Location
                    WHERE city = :city AND us_state = :us_state
                """),
                {"city": city, "us_state": state}
            ).fetchone()

            if not result:
                trans.rollback()
                return jsonify({"status": "invalid location"})

            region_id = result.region_id

            result = conn.execute(
                text("""
                    SELECT COUNT(*) AS cnt
                    FROM User_Reporting u
                    WHERE EXISTS (
                        SELECT 1
                        FROM User_Reporting u2
                        JOIN User u3 ON u2.user_id = u3.user_id
                        WHERE u2.region_id = :reg_id
                          AND u2.square_feet = :sqft
                          AND u2.sold_price = :price
                          AND u3.user_name LIKE 'A%'
                    )
                """),
                {"reg_id": region_id, "sqft": square_feet, "price": sold_price}
            ).fetchone()

            duplicate_report = result.cnt

            result = conn.execute(
                text("""
                    SELECT AVG(h.median_sale_price) AS avg_price
                    FROM Location l
                    JOIN House h ON l.region_id = h.region_id
                    WHERE l.region_id = :reg_id
                    GROUP BY l.region_id
                """),
                {"reg_id": region_id}
            ).fetchone()

            avg_sale = result.avg_price if result else 0

            # Check if insertion allowed
            if duplicate_report != 0 or avg_sale * 10 < sold_price:
                trans.rollback()
                return jsonify({"status": "failed due to transaction condition"})

            result = conn.execute(
                text("SELECT MAX(report_id) FROM User_Reporting")
            )
            max_id = result.scalar() or 0
            new_report_id = max_id + 1

            # Insert record
            conn.execute(
                text("""
                    INSERT INTO User_Reporting (
                        report_id, user_id, region_id, property_type,
                        sold_price, list_price, list_time, sold_time, square_feet
                    )
                    VALUES (
                        :rid, :uid, :reg_id, :ptype,
                        :sold, :list, :ltime, :stime, :sqft
                    )
                """),
                {
                    "rid": new_report_id,
                    "uid": user_id,
                    "reg_id": region_id,
                    "ptype": property_type,
                    "sold": sold_price,
                    "list": list_price,
                    "ltime": list_time,
                    "stime": sold_time,
                    "sqft": square_feet
                }
            )

            trans.commit()
            return jsonify({"status": "successfully inserted"})

        except Exception as e:
            trans.rollback()
            return jsonify({"status": "error", "detail": str(e)})


@app.route("/price_ranking", methods=["POST"])
def price_ranking():
    data = request.json or {}
    pr_city = data.get("city")
    pr_state = data.get("state", "")
    pr_property_type_id = data.get("property_type_id")
    pr_period_start = data.get("period_start")
    pr_period_end = data.get("period_end")
    pr_metric = data.get("metric")

    if not (pr_city and pr_state and pr_property_type_id and pr_period_start and pr_period_end):
        return jsonify({"error": "Missing required fields"}), 400

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                CALL PriceRankings(
                    :pr_city,
                    :pr_state,
                    :pr_property_type_id,
                    :pr_period_start,
                    :pr_period_end,
                    :pr_metric
                )
            """),
            {
                "pr_city": pr_city,
                "pr_state": pr_state,
                "pr_property_type_id": pr_property_type_id,
                "pr_period_start": pr_period_start,
                "pr_period_end": pr_period_end,
                "pr_metric": pr_metric
            }
        )

        row = result.mappings().first()

    if not row:
        return jsonify({
            "metric_value": None,
            "rank_in_state": None,
            "total_cities_in_state": None,
            "rank_in_nation": None,
            "total_cities_in_nation": None
        })

    return jsonify(dict(row))

@app.route("/show_metric", methods=["POST"])
def show_metric():
    data = request.json or {}
    period_begin = data.get("period_begin")
    period_end = data.get("period_end")
    location_type = data.get("location_type")    
    location_value = data.get("location_value")
    property_type = data.get("property_type")
    query_type = data.get("query_type")       
    if not (period_begin and period_end and location_type and location_value and property_type and query_type):
        return jsonify({"error": "Missing required fields"})
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                CALL ShowMetric(
                    :period_begin,
                    :period_end,
                    :location_type,
                    :location_value,
                    :property_type,
                    :query_type
                )
            """),
            {
                "period_begin": period_begin,
                "period_end": period_end,
                "location_type": location_type,
                "location_value": location_value,
                "property_type": property_type,
                "query_type": query_type
            }
        )
        rows = result.mappings().all()
    return jsonify([dict(r) for r in rows])

#show user's favorite houses
@app.route("/favorites_report", methods=["GET"])
def get_favorites_report():
    user_id = request.args.get("user_id")

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT u.report_id, u.user_id, u.region_id, u.property_type, u.sold_price, u.list_price, u.list_time, u.sold_time, u.square_feet
                FROM User_Reporting u
                JOIN Favorites_Report f on u.report_id = f.report_id
                WHERE f.favorite_user_id = :user_id
            """),
            {"user_id": user_id}
        )
        rows = [dict(row._mapping) for row in result]
    return jsonify(rows)

# search favorite houses for a user
@app.route("/favorites_report_search", methods=["POST"])
def search_favorites_report():
    # favorite_user_id = data.get("user_id", "")
    data = request.json
    city = data.get("city", "")
    state = data.get("state", "")
    property_type = data.get("property_type", "")
    sold_price = data.get("sold_price", "")
    list_price = data.get("list_price", "")
    list_time = data.get("list_time", "")
    sold_time = data.get("sold_time", "")
    square_feet = data.get("square_feet", "")

    required = [city, state, property_type, sold_price, list_price, list_time, sold_time, square_feet]
    if any(field == "" for field in required):
        return jsonify({"status": "failed to search due to lacking fields"})
    
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT region_id
                FROM Location
                WHERE city = :city 
                and us_state = :us_state
            """),
            {
                "city": city,
                "us_state": state
            }
        ).fetchone()
        region_id = result.region_id

        result = conn.execute(
            text("""
                SELECT *
                FROM User_Reporting
                WHERE region_id = :region_id
                and property_type = :property_type
                and sold_price <= :sold_price
                and list_price <= :list_price
                and list_time >= :list_time
                and sold_time <= :sold_time
                and square_feet <= :square_feet
            """),
            {
                "region_id": region_id,
                "property_type": property_type,
                "sold_price": sold_price,
                "list_price": list_price,
                "list_time": list_time,
                "sold_time": sold_time,
                "square_feet": square_feet
            }
        )
        rows = [dict(row._mapping) for row in result]
    return jsonify(rows)

# favorite a report
@app.route("/favorites_report", methods=["POST"])
def insert_favorites_report():
    data = request.json
    favorite_user_id = data.get("favorite_user_id", "")
    report_id = data.get("report_id", "")

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT report_id, user_id
                FROM User_Reporting
                WHERE report_id IN :report_id
            """),
            {
                "report_id": tuple(report_id)
            }
        ).fetchall()
        if not result:
            return jsonify({"status": "report not found"})

        result_existing = conn.execute(
            text("""
                SELECT report_id
                FROM Favorites_Report
                WHERE report_id IN :report_id AND favorite_user_id = :favorite_user_id
            """),
            {
                "report_id": tuple(report_id),
                "favorite_user_id": favorite_user_id
            }
        ).fetchall()
        if result_existing:
            return jsonify({"status": "report already favorited"})

        for id in result:
            conn.execute(
                text("""
                    INSERT INTO Favorites_Report (favorite_user_id, reporting_user_id, report_id)
                    VALUES (:favorite_user_id, :reporting_user_id, :report_id)
                """),
                {
                    "favorite_user_id": favorite_user_id,
                    "reporting_user_id": id._mapping["user_id"],
                    "report_id": id._mapping["report_id"]
                }
            )
            conn.commit()

    return jsonify({"status": "successfully insert"})

# delete a favorite report
@app.route("/favorites_report", methods=["DELETE"])
def delete_favorites_report():
    data = request.json
    favorite_user_id = data.get("favorite_user_id", "")
    report_id = data.get("report_id", "")

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT report_id, user_id
                FROM User_Reporting
                WHERE report_id IN :report_id
            """),
            {
                "report_id": tuple(report_id)
            }
        ).fetchall()
        if not result:
            return jsonify({"status": "report not found"})

        for id in result:
            conn.execute(
                text("""
                    DELETE FROM Favorites_Report
                    WHERE favorite_user_id = :favorite_user_id
                    and report_id = :report_id
                    and reporting_user_id = :reporting_user_id
                """),
                {
                    "favorite_user_id": favorite_user_id,
                    "report_id": id._mapping["report_id"],
                    "reporting_user_id": id._mapping["user_id"]
                }
            )
            conn.commit()

    return jsonify({"status": "successfully delete"})

@app.route("/favorite_query", methods=["POST"])
def insert_favorite_query():
    data = request.json
    user_id = data.get("user_id")
    period_begin = data.get("period_begin")
    period_end = data.get("period_end")
    location_type = data.get("location_type")    
    location_value = data.get("location_value")
    # location = data.get("location")
    property_type = data.get("property_type_id")
    query_type = data.get("query_type")
    visualization_type = data.get("vis_type")
    data_type = "House"
     
    if not (period_begin and period_end and location_type and location_value and property_type and query_type and visualization_type):
        return jsonify({"error": "Missing required fields"})
    
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT MAX(query_id) FROM Favorite_Query")
        )
        count = result.scalar() or 0
        query_id = count + 1

        result = conn.execute(
            text("""
                INSERT INTO Favorite_Query (query_id, user_id, 
                period_begin, period_end, location_type, 
                location_value, property_type_id, query_type, visualization_type, data_type)
                VALUES (:query_id, :user_id, 
                :period_begin, :period_end, :location_type,
                :location_value, :property_type_id, :query_type, :visualization_type, :data_type
                )
            """),
            {
                "query_id": query_id,
                "user_id": user_id,
                "period_begin": period_begin,
                "period_end": period_end,
                "location_type": location_type,
                "location_value": location_value,
                "property_type_id": property_type,
                "query_type": query_type,
                "visualization_type": visualization_type,
                "data_type": data_type
            }
        )
        conn.commit()
        
    return jsonify({"status": "successfully insert"})

@app.route("/favorite_query", methods=["GET"])
def get_favorite_query():
    user_id = request.args.get("user_id")

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT *
                FROM Favorite_Query
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        )
        rows = [dict(row._mapping) for row in result]
    return jsonify(rows)

@app.route("/favorite_query", methods=["DELETE"])
def delete_favorite_query():
    data = request.json
    query_id = data.get("query_id", "")

    with engine.connect() as conn:
        conn.execute(
            text("""
                DELETE FROM Favorite_Query
                WHERE query_id IN :query_id
            """),
            {
                "query_id": tuple(query_id)
            }
        )
        conn.commit()

    return jsonify({"status": "successfully delete"})

if __name__ == "__main__":
    app.run(debug=False)