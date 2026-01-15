from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required
from flask_cors import CORS
from auth import auth_bp
from nlp import analyze_text

app = Flask(__name__)
CORS(app)  # 👈 ADD THIS LINE

app.config["JWT_SECRET_KEY"] = "secret-key"
jwt = JWTManager(app)

app.register_blueprint(auth_bp)

@app.route("/")
def home():
    return "Backend is running"

@app.route("/analyze", methods=["POST"])
@jwt_required()
def analyze():
    text = request.json.get("text")
    result = analyze_text(text)
    return jsonify({"sentiment": result})

if __name__ == "__main__":
    app.run(debug=True)
