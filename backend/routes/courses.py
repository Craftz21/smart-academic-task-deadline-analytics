"""
Courses Routes
GET  /courses      — List all courses
POST /courses      — Create a course (admin/faculty)
PUT  /courses/:id  — Update a course
DELETE /courses/:id — Delete a course
"""

from flask import Blueprint, request, jsonify
from models import get_db

courses_bp = Blueprint("courses", __name__)


def course_to_dict(row):
    return {
        "id":          row["id"],
        "name":        row["name"],
        "code":        row["code"],
        "faculty_id":  row["faculty_id"],
        "faculty_name": row["faculty_name"] if "faculty_name" in row.keys() else None,
        "created_at":  row["created_at"],
    }


@courses_bp.route("/courses", methods=["GET"])
def list_courses():
    conn = get_db()
    rows = conn.execute("""
        SELECT c.*, u.full_name AS faculty_name
        FROM courses c
        LEFT JOIN users u ON c.faculty_id = u.id
        ORDER BY c.name
    """).fetchall()
    conn.close()
    return jsonify([course_to_dict(r) for r in rows]), 200


@courses_bp.route("/courses", methods=["POST"])
def create_course():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("code"):
        return jsonify({"error": "name and code are required"}), 400

    conn = get_db()
    try:
        cur = conn.execute(
            "INSERT INTO courses (name, code, faculty_id) VALUES (?,?,?)",
            (data["name"], data["code"], data.get("faculty_id"))
        )
        conn.commit()
        course = conn.execute("""
            SELECT c.*, u.full_name AS faculty_name
            FROM courses c LEFT JOIN users u ON c.faculty_id=u.id
            WHERE c.id=?
        """, (cur.lastrowid,)).fetchone()
        conn.close()
        return jsonify(course_to_dict(course)), 201
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 409


@courses_bp.route("/courses/<int:course_id>", methods=["PUT"])
def update_course(course_id):
    data = request.get_json()
    conn = get_db()
    conn.execute(
        "UPDATE courses SET name=COALESCE(?,name), code=COALESCE(?,code), faculty_id=COALESCE(?,faculty_id) WHERE id=?",
        (data.get("name"), data.get("code"), data.get("faculty_id"), course_id)
    )
    conn.commit()
    course = conn.execute("""
        SELECT c.*, u.full_name AS faculty_name
        FROM courses c LEFT JOIN users u ON c.faculty_id=u.id
        WHERE c.id=?
    """, (course_id,)).fetchone()
    conn.close()
    if not course:
        return jsonify({"error": "Course not found"}), 404
    return jsonify(course_to_dict(course)), 200


@courses_bp.route("/courses/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    conn = get_db()
    conn.execute("DELETE FROM courses WHERE id=?", (course_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Course deleted"}), 200
