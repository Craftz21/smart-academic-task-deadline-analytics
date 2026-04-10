"""
Database Models and Initialization
Uses SQLite via Python's built-in sqlite3 module
"""

import sqlite3
import os
from datetime import datetime, timedelta
import hashlib

# Support Docker volume mount: set DB_PATH env var to override location
DB_PATH = os.environ.get(
    "DB_PATH",
    os.path.join(os.path.dirname(__file__), "database.db")
)


def get_db():
    """Get a database connection with row factory for dict-like access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Rows accessible like dicts
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def hash_password(password: str) -> str:
    """Simple SHA-256 password hashing."""
    return hashlib.sha256(password.encode()).hexdigest()


def init_db():
    """
    Initialize database tables and seed with demo data if empty.
    Called once on app startup.
    """
    conn = get_db()
    cur = conn.cursor()

    # ── Users Table ────────────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            username    TEXT NOT NULL UNIQUE,
            password    TEXT NOT NULL,
            role        TEXT NOT NULL CHECK(role IN ('student', 'faculty', 'admin')),
            full_name   TEXT NOT NULL,
            email       TEXT,
            created_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    # ── Courses Table ──────────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            code        TEXT NOT NULL UNIQUE,
            faculty_id  INTEGER REFERENCES users(id),
            created_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    # ── Tasks Table ────────────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT NOT NULL,
            description TEXT,
            course_id   INTEGER REFERENCES courses(id),
            deadline    TEXT NOT NULL,
            priority    TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
            status      TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
            created_by  INTEGER REFERENCES users(id),
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    conn.commit()

    # ── Seed Demo Data (only if tables are empty) ──────────────────────────────
    user_count = cur.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    if user_count == 0:
        _seed_demo_data(conn, cur)

    conn.close()
    print("✅ Database initialized")


def _seed_demo_data(conn, cur):
    """Insert demo users, courses, and tasks."""

    now = datetime.now()

    # Demo users
    users = [
        ("admin",   hash_password("admin123"),   "admin",   "Admin User",       "admin@university.edu"),
        ("prof_alex", hash_password("prof123"),  "faculty", "Prof. Alex Morgan", "alex@university.edu"),
        ("prof_sam",  hash_password("prof123"),  "faculty", "Prof. Sam Rivera",  "sam@university.edu"),
        ("student1",  hash_password("student123"), "student", "Alice Johnson",   "alice@student.edu"),
        ("student2",  hash_password("student123"), "student", "Bob Chen",        "bob@student.edu"),
        ("student3",  hash_password("student123"), "student", "Carol Davis",     "carol@student.edu"),
    ]
    cur.executemany(
        "INSERT INTO users (username, password, role, full_name, email) VALUES (?,?,?,?,?)",
        users
    )

    # Get faculty IDs
    prof_alex_id = cur.execute("SELECT id FROM users WHERE username='prof_alex'").fetchone()[0]
    prof_sam_id  = cur.execute("SELECT id FROM users WHERE username='prof_sam'").fetchone()[0]

    # Demo courses
    courses = [
        ("Data Structures",      "CS201", prof_alex_id),
        ("Algorithms",           "CS301", prof_alex_id),
        ("Database Systems",     "CS401", prof_sam_id),
        ("Machine Learning",     "CS501", prof_sam_id),
        ("Operating Systems",    "CS351", prof_alex_id),
    ]
    cur.executemany(
        "INSERT INTO courses (name, code, faculty_id) VALUES (?,?,?)",
        courses
    )

    # Get course IDs
    def cid(code):
        return cur.execute("SELECT id FROM courses WHERE code=?", (code,)).fetchone()[0]

    # Demo tasks spread across coming weeks
    tasks = [
        ("Binary Tree Assignment",   "Implement BST operations",      cid("CS201"), (now + timedelta(days=3)).strftime("%Y-%m-%d"),  "high",   "pending",     prof_alex_id),
        ("Sorting Algorithm Lab",    "Implement QuickSort & MergeSort",cid("CS301"), (now + timedelta(days=7)).strftime("%Y-%m-%d"),  "high",   "in_progress", prof_alex_id),
        ("SQL Query Project",        "Write complex JOIN queries",     cid("CS401"), (now + timedelta(days=5)).strftime("%Y-%m-%d"),  "medium", "pending",     prof_sam_id),
        ("Neural Network Basics",    "Build a simple neural net",      cid("CS501"), (now + timedelta(days=14)).strftime("%Y-%m-%d"), "high",   "pending",     prof_sam_id),
        ("Process Scheduling Quiz",  "Short quiz on CPU scheduling",   cid("CS351"), (now + timedelta(days=2)).strftime("%Y-%m-%d"),  "low",    "pending",     prof_alex_id),
        ("Hash Table Implementation","Chaining vs Open Addressing",    cid("CS201"), (now + timedelta(days=10)).strftime("%Y-%m-%d"), "medium", "completed",   prof_alex_id),
        ("Graph Traversal Report",   "BFS and DFS comparison report",  cid("CS301"), (now + timedelta(days=1)).strftime("%Y-%m-%d"),  "high",   "in_progress", prof_alex_id),
        ("ER Diagram Submission",    "Design ER for library system",   cid("CS401"), (now - timedelta(days=3)).strftime("%Y-%m-%d"),  "medium", "completed",   prof_sam_id),
        ("K-Means Clustering Lab",   "Apply K-Means on dataset",       cid("CS501"), (now + timedelta(days=20)).strftime("%Y-%m-%d"), "medium", "pending",     prof_sam_id),
        ("Memory Management Essay",  "Virtual memory concepts essay",  cid("CS351"), (now - timedelta(days=1)).strftime("%Y-%m-%d"),  "low",    "pending",     prof_alex_id),
        ("AVL Tree Coding Test",     "Rotations and balancing",        cid("CS201"), (now + timedelta(days=4)).strftime("%Y-%m-%d"),  "high",   "pending",     prof_alex_id),
        ("Dynamic Programming HW",   "Knapsack & LCS problems",        cid("CS301"), (now + timedelta(days=9)).strftime("%Y-%m-%d"),  "medium", "in_progress", prof_alex_id),
    ]
    cur.executemany(
        "INSERT INTO tasks (title, description, course_id, deadline, priority, status, created_by) VALUES (?,?,?,?,?,?,?)",
        tasks
    )

    conn.commit()
    print("✅ Demo data seeded")
