from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# --------------------------------------------------
# Load environment variables
# --------------------------------------------------
load_dotenv()

# --------------------------------------------------
# App setup
# --------------------------------------------------
app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "super-secret-key")
jwt = JWTManager(app)

# --------------------------------------------------
# MongoDB setup
# --------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

db = client["lexfix"]
users_col = db["users"]
tasks_col = db["tasks"]
submissions_col = db["submissions"]

# --------------------------------------------------
# Home
# --------------------------------------------------
@app.route("/")
def home():
    return "LexFix Backend Running"

# --------------------------------------------------
# AUTH ROUTES
# --------------------------------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return jsonify({"error": "All fields required"}), 400

    if users_col.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    users_col.insert_one({
        "email": email,
        "password": generate_password_hash(password),
        "role": role
    })

    return jsonify({"message": "Registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    user = users_col.find_one({"email": email, "role": role})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid password"}), 401

    token = create_access_token(identity=email)

    return jsonify({"token": token, "role": role}), 200

# --------------------------------------------------
# TEACHER
# --------------------------------------------------
@app.route("/assign-task", methods=["POST"])
@jwt_required()
def assign_task():
    teacher_email = get_jwt_identity()
    data = request.get_json()

    task = {
        "title": data["title"],
        "description": data["description"],
        "student_email": data["student_email"],
        "assigned_by": teacher_email,
        "status": "assigned"
    }

    tasks_col.insert_one(task)
    return jsonify({"message": "Task assigned successfully"}), 200

# --------------------------------------------------
# STUDENT
# --------------------------------------------------
@app.route("/my-tasks", methods=["GET"])
@jwt_required()
def my_tasks():
    student_email = get_jwt_identity()

    tasks = list(tasks_col.find(
        {"student_email": student_email},
        {"_id": 0}
    ))

    return jsonify(tasks), 200


@app.route("/submit-task", methods=["POST"])
@jwt_required()
def submit_task():
    student_email = get_jwt_identity()
    data = request.get_json()

    submissions_col.insert_one({
        "student_email": student_email,
        "task_title": data["task_title"],
        "content": data["content"],
        "score": 80
    })

    return jsonify({"message": "Task submitted"}), 200

# --------------------------------------------------
# PARENT
# --------------------------------------------------
@app.route("/child-performance", methods=["POST"])
@jwt_required()
def child_performance():
    child_email = request.json.get("child_email")

    tasks = list(tasks_col.find(
        {"student_email": child_email},
        {"_id": 0}
    ))

    submissions = list(submissions_col.find(
        {"student_email": child_email},
        {"_id": 0}
    ))

    return jsonify({
        "tasks": tasks,
        "submissions": submissions
    }), 200

# --------------------------------------------------
# Run
# --------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
