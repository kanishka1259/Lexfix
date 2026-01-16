from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db

tasks_bp = Blueprint("tasks", __name__)
tasks_collection = db["tasks"]
submissions_collection = db["submissions"]

# Teacher assigns task
@tasks_bp.route("/assign-task", methods=["POST"])
@jwt_required()
def assign_task():
    data = request.get_json()
    task = {
        "title": data["title"],
        "description": data["description"],
        "assigned_to": data["student_email"]
    }
    tasks_collection.insert_one(task)
    return jsonify({"message": "Task assigned successfully"})


# Student views tasks
@tasks_bp.route("/my-tasks", methods=["GET"])
@jwt_required()
def my_tasks():
    email = get_jwt_identity()
    tasks = list(tasks_collection.find({"assigned_to": email}, {"_id": 0}))
    return jsonify(tasks)


# Student submits task
@tasks_bp.route("/submit-task", methods=["POST"])
@jwt_required()
def submit_task():
    email = get_jwt_identity()
    data = request.get_json()
    submission = {
        "student": email,
        "task_title": data["task_title"],
        "content": data["content"],
        "score": 80  # dummy score for now
    }
    submissions_collection.insert_one(submission)
    return jsonify({"message": "Task submitted"})
