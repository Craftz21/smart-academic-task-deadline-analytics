"""
Users Routes
GET  /users      — List all users (admin only)
POST /users      — Create a user (admin only)
PUT  /users/:id  — Update user
DELETE /users/:id — Delete user (admin)
"""

from flask import Blueprint, request, jsonify
from models import get_db, hash_password

users_bp = Blueprint("users", __name__)


def user_to_dict(row):
    return {
        "id":         row["id"],
        "username":   row["username"],
        "role":       row["role"],
        "full_name":  row["full_name"],
        "email":      row["email"],
        "created_at": row["created_at"],
    }


@users_bp.route("/users", methods=["GET"])
def list_users():
    role = request.args.get("role")
    conn = get_db()
    if role:
        rows = conn.execute(
            "SELECT id, username, role, full_name, email, created_at FROM users WHERE role=? ORDER BY full_name",
            (role,)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT id, username, role, full_name, email, created_at FROM users ORDER BY role, full_name"
        ).fetchall()
    conn.close()
    return jsonify([user_to_dict(r) for r in rows]), 200


@users_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    required = ["username", "password", "role", "full_name"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing: {', '.join(missing)}"}), 400

    if data["role"] not in ("student", "faculty", "admin"):
        return jsonify({"error": "Invalid role"}), 400

    conn = get_db()
    try:
        cur = conn.execute(
            "INSERT INTO users (username, password, role, full_name, email) VALUES (?,?,?,?,?)",
            (data["username"], hash_password(data["password"]), data["role"], data["full_name"], data.get("email", ""))
        )
        conn.commit()
        user = conn.execute(
            "SELECT id, username, role, full_name, email, created_at FROM users WHERE id=?",
            (cur.lastrowid,)
        ).fetchone()
        conn.close()
        return jsonify(user_to_dict(user)), 201
    except Exception as e:
        conn.close()
        return jsonify({"error": "Username already exists"}), 409


@users_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    conn = get_db()
    if data.get("password"):
        conn.execute(
            "UPDATE users SET full_name=COALESCE(?,full_name), email=COALESCE(?,email), role=COALESCE(?,role), password=? WHERE id=?",
            (data.get("full_name"), data.get("email"), data.get("role"), hash_password(data["password"]), user_id)
        )
    else:
        conn.execute(
            "UPDATE users SET full_name=COALESCE(?,full_name), email=COALESCE(?,email), role=COALESCE(?,role) WHERE id=?",
            (data.get("full_name"), data.get("email"), data.get("role"), user_id)
        )
    conn.commit()
    user = conn.execute(
        "SELECT id, username, role, full_name, email, created_at FROM users WHERE id=?",
        (user_id,)
    ).fetchone()
    conn.close()
    return jsonify(user_to_dict(user)), 200


@users_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    conn = get_db()
    conn.execute("DELETE FROM users WHERE id=?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "User deleted"}), 200
