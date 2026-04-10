"""
Task Routes
GET    /tasks       — List all tasks (with optional filters)
POST   /tasks       — Create a new task (faculty only)
GET    /tasks/:id   — Get a single task
PUT    /tasks/:id   — Update a task (faculty only)
DELETE /tasks/:id   — Delete a task (faculty/admin only)
"""

from flask import Blueprint, request, jsonify
from services.task_service import (
    get_all_tasks,
    get_task_by_id,
    create_task,
    update_task,
    delete_task,
)

tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.route("/tasks", methods=["GET"])
def list_tasks():
    status    = request.args.get("status")
    priority  = request.args.get("priority")
    course_id = request.args.get("course_id")
    tasks = get_all_tasks(status=status, priority=priority, course_id=course_id)
    return jsonify(tasks), 200


@tasks_bp.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required = ["title", "course_id", "deadline", "priority"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    user_id = request.headers.get("X-User-Id")
    task = create_task(data, created_by=user_id)
    return jsonify(task), 201


@tasks_bp.route("/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = get_task_by_id(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task), 200


@tasks_bp.route("/tasks/<int:task_id>", methods=["PUT"])
def edit_task(task_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    task = update_task(task_id, data)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task), 200


@tasks_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
def remove_task(task_id):
    success = delete_task(task_id)
    if not success:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({"message": "Task deleted"}), 200
