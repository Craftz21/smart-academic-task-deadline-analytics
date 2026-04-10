"""
Task Service — Business Logic Layer
Handles all task CRUD operations with DB queries.
Keeps routes thin and logic testable.
"""

from models import get_db
from datetime import datetime


def task_to_dict(row):
    """Convert a sqlite3.Row to a plain dict for JSON serialization."""
    d = dict(row)
    # Determine if overdue
    try:
        deadline_dt = datetime.strptime(d["deadline"], "%Y-%m-%d")
        d["is_overdue"] = (
            deadline_dt.date() < datetime.now().date()
            and d["status"] != "completed"
        )
        d["days_until_deadline"] = (deadline_dt.date() - datetime.now().date()).days
    except Exception:
        d["is_overdue"] = False
        d["days_until_deadline"] = None
    return d


def get_all_tasks(status=None, priority=None, course_id=None):
    """Fetch tasks with optional filters, joined with course and creator info."""
    conn = get_db()
    query = """
        SELECT
            t.*,
            c.name  AS course_name,
            c.code  AS course_code,
            u.full_name AS created_by_name
        FROM tasks t
        LEFT JOIN courses c ON t.course_id = c.id
        LEFT JOIN users   u ON t.created_by = u.id
        WHERE 1=1
    """
    params = []
    if status:
        query += " AND t.status = ?"
        params.append(status)
    if priority:
        query += " AND t.priority = ?"
        params.append(priority)
    if course_id:
        query += " AND t.course_id = ?"
        params.append(course_id)

    query += " ORDER BY t.deadline ASC"

    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [task_to_dict(r) for r in rows]


def get_task_by_id(task_id: int):
    conn = get_db()
    row = conn.execute("""
        SELECT t.*, c.name AS course_name, c.code AS course_code, u.full_name AS created_by_name
        FROM tasks t
        LEFT JOIN courses c ON t.course_id = c.id
        LEFT JOIN users   u ON t.created_by = u.id
        WHERE t.id = ?
    """, (task_id,)).fetchone()
    conn.close()
    return task_to_dict(row) if row else None


def create_task(data: dict, created_by=None) -> dict:
    conn = get_db()
    cur = conn.execute("""
        INSERT INTO tasks (title, description, course_id, deadline, priority, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data["title"],
        data.get("description", ""),
        data["course_id"],
        data["deadline"],
        data["priority"],
        data.get("status", "pending"),
        created_by,
    ))
    conn.commit()
    task_id = cur.lastrowid
    conn.close()
    return get_task_by_id(task_id)


def update_task(task_id: int, data: dict) -> dict | None:
    task = get_task_by_id(task_id)
    if not task:
        return None

    conn = get_db()
    conn.execute("""
        UPDATE tasks
        SET title       = COALESCE(?, title),
            description = COALESCE(?, description),
            course_id   = COALESCE(?, course_id),
            deadline    = COALESCE(?, deadline),
            priority    = COALESCE(?, priority),
            status      = COALESCE(?, status),
            updated_at  = datetime('now')
        WHERE id = ?
    """, (
        data.get("title"),
        data.get("description"),
        data.get("course_id"),
        data.get("deadline"),
        data.get("priority"),
        data.get("status"),
        task_id,
    ))
    conn.commit()
    conn.close()
    return get_task_by_id(task_id)


def delete_task(task_id: int) -> bool:
    task = get_task_by_id(task_id)
    if not task:
        return False
    conn = get_db()
    conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    conn.commit()
    conn.close()
    return True
