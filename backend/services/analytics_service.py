"""
Analytics Service — Compute workload and deadline metrics.
Called by the /analytics route to return dashboard data.
"""

from models import get_db
from datetime import datetime, timedelta
from collections import defaultdict


def compute_analytics() -> dict:
    """
    Returns a comprehensive analytics payload:
    - summary counts
    - tasks per week (next 4 weeks)
    - status distribution
    - priority distribution
    - overdue tasks
    - upcoming deadlines (next 7 days)
    - workload score
    - per-course breakdown
    """
    conn = get_db()
    today = datetime.now().date()

    # ── All tasks ──────────────────────────────────────────────────────────────
    rows = conn.execute("""
        SELECT t.*, c.name AS course_name
        FROM tasks t
        LEFT JOIN courses c ON t.course_id = c.id
    """).fetchall()
    tasks = [dict(r) for r in rows]
    conn.close()

    total = len(tasks)
    if total == 0:
        return _empty_analytics()

    # ── Status counts ──────────────────────────────────────────────────────────
    status_counts = defaultdict(int)
    for t in tasks:
        status_counts[t["status"]] += 1

    completed  = status_counts["completed"]
    pending    = status_counts["pending"]
    in_progress = status_counts["in_progress"]
    completion_pct = round((completed / total) * 100, 1) if total else 0

    # ── Priority counts ────────────────────────────────────────────────────────
    priority_counts = defaultdict(int)
    for t in tasks:
        priority_counts[t["priority"]] += 1

    # ── Overdue detection ──────────────────────────────────────────────────────
    overdue = []
    for t in tasks:
        try:
            dl = datetime.strptime(t["deadline"], "%Y-%m-%d").date()
            if dl < today and t["status"] != "completed":
                days_overdue = (today - dl).days
                overdue.append({**t, "days_overdue": days_overdue})
        except Exception:
            pass
    overdue.sort(key=lambda x: x["days_overdue"], reverse=True)

    # ── Upcoming deadlines (next 7 days) ───────────────────────────────────────
    upcoming = []
    for t in tasks:
        try:
            dl = datetime.strptime(t["deadline"], "%Y-%m-%d").date()
            days_left = (dl - today).days
            if 0 <= days_left <= 7 and t["status"] != "completed":
                upcoming.append({**t, "days_left": days_left})
        except Exception:
            pass
    upcoming.sort(key=lambda x: x["days_left"])

    # ── Tasks per week (next 4 weeks) ─────────────────────────────────────────
    weeks_data = []
    for week_offset in range(4):
        week_start = today + timedelta(days=week_offset * 7)
        week_end   = week_start + timedelta(days=6)
        label = f"Week {week_offset + 1} ({week_start.strftime('%b %d')})"
        count = sum(
            1 for t in tasks
            if _in_range(t["deadline"], week_start, week_end)
        )
        weeks_data.append({"week": label, "count": count})

    # ── Course breakdown ───────────────────────────────────────────────────────
    course_map = defaultdict(lambda: {"total": 0, "completed": 0, "pending": 0, "in_progress": 0})
    for t in tasks:
        cn = t.get("course_name") or "Unknown"
        course_map[cn]["total"] += 1
        course_map[cn][t["status"]] += 1

    course_breakdown = [
        {"course": k, **v} for k, v in course_map.items()
    ]
    course_breakdown.sort(key=lambda x: x["total"], reverse=True)

    # ── Workload Score (0–100) ─────────────────────────────────────────────────
    # Formula: weighted sum of urgency signals
    workload_score = _calculate_workload_score(tasks, today)

    return {
        "summary": {
            "total":          total,
            "completed":      completed,
            "pending":        pending,
            "in_progress":    in_progress,
            "overdue":        len(overdue),
            "upcoming_7days": len(upcoming),
            "completion_pct": completion_pct,
        },
        "status_distribution": [
            {"name": "Completed",   "value": completed,   "color": "#22c55e"},
            {"name": "Pending",     "value": pending,     "color": "#f59e0b"},
            {"name": "In Progress", "value": in_progress, "color": "#3b82f6"},
        ],
        "priority_distribution": [
            {"name": "High",   "value": priority_counts["high"],   "color": "#ef4444"},
            {"name": "Medium", "value": priority_counts["medium"], "color": "#f59e0b"},
            {"name": "Low",    "value": priority_counts["low"],    "color": "#22c55e"},
        ],
        "tasks_per_week":    weeks_data,
        "course_breakdown":  course_breakdown,
        "overdue_tasks":     overdue[:5],   # Top 5 most overdue
        "upcoming_deadlines": upcoming[:8], # Next 8 upcoming
        "workload_score":    workload_score,
    }


def _in_range(deadline_str: str, start, end) -> bool:
    try:
        dl = datetime.strptime(deadline_str, "%Y-%m-%d").date()
        return start <= dl <= end
    except Exception:
        return False


def _calculate_workload_score(tasks, today) -> int:
    """
    Workload score 0–100.
    Higher score = heavier workload.
    Factors: # of non-completed tasks, proximity of deadlines, priority weights.
    """
    score = 0
    priority_weights = {"high": 10, "medium": 5, "low": 2}

    for t in tasks:
        if t["status"] == "completed":
            continue
        base = priority_weights.get(t["priority"], 3)
        try:
            dl = datetime.strptime(t["deadline"], "%Y-%m-%d").date()
            days_left = (dl - today).days
            if days_left < 0:        # Overdue
                urgency = 3.0
            elif days_left <= 2:
                urgency = 2.5
            elif days_left <= 7:
                urgency = 1.5
            elif days_left <= 14:
                urgency = 1.0
            else:
                urgency = 0.5
        except Exception:
            urgency = 1.0

        score += base * urgency

    # Normalize to 0–100 (cap at 100)
    return min(100, int(score))


def _empty_analytics() -> dict:
    return {
        "summary": {
            "total": 0, "completed": 0, "pending": 0,
            "in_progress": 0, "overdue": 0,
            "upcoming_7days": 0, "completion_pct": 0,
        },
        "status_distribution":  [],
        "priority_distribution": [],
        "tasks_per_week":        [],
        "course_breakdown":      [],
        "overdue_tasks":         [],
        "upcoming_deadlines":    [],
        "workload_score":        0,
    }
