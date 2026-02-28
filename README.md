# Smart Academic Task & Deadline Analytics System
A web-based application designed to help students and faculty manage academic tasks, track deadlines, and analyze workload distribution using simple analytics and visual dashboards.

# Problem It Solves
Students often struggle with overlapping deadlines and poor task prioritization. Faculty lack visibility into workload congestion across courses. Existing tools are either complex or not analytics-focused. This system provides a simple, centralized solution for task tracking and workload analysis.

# Target Users (Personas)
- Student: Wants to track assignments and avoid missing deadlines.
- Faculty Member: Wants to analyze workload trends and avoid deadline clustering.
- Admin: Manages users and courses.

# Vision Statement
To provide a simple, analytics-driven academic planning tool that improves time management and reduces deadline-related stress for students and faculty.

# Key Features / Goals 
- Task and deadline management
- Workload analytics (weekly/monthly)
- Visual dashboards
- Role-based access (student, faculty, admin)
- Simple and intuitive UI

# Success Metrics
- Users can track all tasks without external tools
- Analytics correctly highlight high-workload periods
- At least 80% of users can use the system without guidance

# Assumptions & Constraints

Assumptions:
- Users manually enter tasks and deadlines
- Users have access to a web browser

Constraints:
- Short academic timeline
- Open-source tools only
- No heavy machine learning


## Branching Strategy
This project follows GitHub Flow.
- main: stable production branch
- feature/*: feature development branches

## Local Development Tools
- Git & GitHub
- Docker Desktop
- VS Code
- Python / Node.js

## Quick Start – Local Development

cd backend
docker build -t academic-tracker .
docker run -p 5000:5000 academic-tracker

Open http://localhost:5000 in browser

## Software Design

This project follows a layered client-server architecture to ensure separation of concerns, modularity, and maintainability.

The system is divided into four layers:
- Presentation Layer (Frontend UI)
- Application Layer (Flask REST API)
- Data Layer (Database)
- Deployment Layer (Docker Container)

The architecture ensures low coupling between modules and high cohesion within each service. Business logic, analytics processing, and data handling are isolated to allow future scalability and easier maintenance.

### Figma Prototype

Figma Design Link: ### Figma Prototype

Figma Design Link: https://www.figma.com/make/rxUGHme1jQNwu41HFks2Ua/Web-Dashboard-UI-Flow?fullscreen=1&t=K5XGbS0Ip27M5K6a-1
