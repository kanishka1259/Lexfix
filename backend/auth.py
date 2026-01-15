from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from users import users

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if email not in users:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(users[email], password):
        return jsonify({"error": "Wrong password"}), 401

    token = create_access_token(identity=email)
    return jsonify({"token": token})
