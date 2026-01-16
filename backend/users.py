from werkzeug.security import generate_password_hash

users = {
    "admin@gmail.com": generate_password_hash("admin123")
}
