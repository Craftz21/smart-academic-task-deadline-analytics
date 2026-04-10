"""
Analytics Routes
GET /analytics — Return computed analytics dashboard data
"""

from flask import Blueprint, jsonify
from services.analytics_service import compute_analytics

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/analytics", methods=["GET"])
def get_analytics():
    data = compute_analytics()
    return jsonify(data), 200
