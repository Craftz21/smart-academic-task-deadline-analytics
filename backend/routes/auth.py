"""
Authentication Routes
POST /login  — Validate credentials and return user session info
POST /logout — Clear session (stateless: just a signal to frontend)
GET  /me     — Return current user from session
"""

from flask import Blueprint, request, jsonify, session
from models import get_db, hash_password

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    conn = get_db()
    user = conn.execute(
        "SELECT id, username, role, full_name, email FROM users WHERE username=? AND password=?",
        (username, hash_password(password))
    ).fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    user_data = {
        "id":        user["id"],
        "username":  user["username"],
        "role":      user["role"],
        "full_name": user["full_name"],
        "email":     user["email"],
    }
    return jsonify({"message": "Login successful", "user": user_data}), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logged out"}), 200


@auth_bp.route("/me", methods=["GET"])
def me():
    # Stateless: frontend passes user_id via header
    user_id = request.headers.get("X-User-Id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    conn = get_db()
    user = conn.execute(
        "SELECT id, username, role, full_name, email FROM users WHERE id=?",
        (user_id,)
    ).fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(dict(user)), 200
