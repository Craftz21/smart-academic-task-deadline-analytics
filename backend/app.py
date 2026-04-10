"""
Smart Academic Task & Deadline Analytics System
Main Flask Application Entry Point
"""

from flask import Flask
from flask_cors import CORS
from models import init_db


from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.analytics import analytics_bp
from routes.courses import courses_bp
from routes.users import users_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for frontend (Vite dev server on port 5173)
    CORS(app)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Initialize database
    init_db()

    # Register blueprints (route modules)
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(users_bp)

    @app.route("/")
    def health():
        return {"status": "ok", "message": "Academic Task System API running"}

    return app


if __name__ == "__main__":
    app = create_app()
    print("🚀 Backend running at http://localhost:5000")
    app.run(debug=True, port=5000, host="0.0.0.0")
