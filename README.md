# 🎓 Smart Academic Task & Deadline Analytics System

A full-stack web application designed to help students and faculty manage academic tasks, track deadlines, and analyze workload distribution using analytics and visual dashboards.

---

## 🧠 Problem It Solves

Students often struggle with overlapping deadlines and poor task prioritization. Faculty lack visibility into workload congestion across courses. Existing tools are either complex or lack analytics capabilities.

This system provides a simple, centralized solution for task tracking and workload analysis, improving productivity and reducing academic stress.

---

## 👥 Target Users (Personas)

- **Student:** Wants to track assignments and avoid missing deadlines  
- **Faculty Member:** Wants to analyze workload trends and avoid deadline clustering  
- **Admin:** Manages users and courses  

---

## 🎯 Vision Statement

To provide a simple, analytics-driven academic planning tool that improves time management and reduces deadline-related stress for students and faculty.

---

## 🚀 Key Features

- Task and deadline management  
- Workload analytics (weekly/monthly)  
- Visual dashboards  
- Role-based access (student, faculty, admin)  
- Simple and intuitive UI  

---

## 📊 Success Metrics

- Users can track all tasks without external tools  
- Analytics correctly highlight high-workload periods  
- At least 80% of users can use the system without guidance  

---

## ⚠️ Assumptions & Constraints

### Assumptions:
- Users manually enter tasks and deadlines  
- Users have access to a web browser  

### Constraints:
- Short academic timeline  
- Open-source tools only  
- No heavy machine learning  

---

## 🌿 Branching Strategy

This project follows **GitHub Flow**:

- `main` → Stable production branch  
- `feature/*` → Feature development branches  

---

## 🛠 Local Development Tools

- Git & GitHub  
- Docker Desktop  
- VS Code  
- Python / Node.js  

---
## 🌐 API Endpoints

| Method | Endpoint        | Description                |
|--------|---------------|----------------------------|
| POST   | `/login`       | User authentication        |
| GET    | `/tasks`       | Fetch all tasks            |
| POST   | `/tasks`       | Create a new task          |
| PUT    | `/tasks/:id`   | Update task details        |
| GET    | `/analytics`   | Retrieve analytics data    |
| GET    | `/courses`     | Fetch course list          |

---

## 📊 Analytics Features

- Task summary (Completed, Pending, Overdue)  
- Priority distribution visualization  
- Weekly workload trends  
- Course-wise task breakdown  
- Upcoming deadline tracking  
- Workload score calculation (based on priority & urgency)  

---

## 🐳 Docker Architecture

- **Backend** → Flask application running in a container  
- **Frontend** → Built using Vite and served via NGINX  
- **Docker Compose** → Manages multi-container setup  

---

## 🧪 Testing

The system was validated using multiple testing strategies:

### ✔ Integration Testing
- Verified communication between frontend and backend APIs  
- Example: Successful login request returning HTTP 200 response  

### ✔ Regression Testing
- Ensured previously implemented features (dashboard, tasks, analytics) function correctly after updates  

### ✔ Mutation Testing
- Introduced invalid inputs and modified logic to test system robustness and error handling  

---

## ⚙️ Tech Stack

| Layer       | Technology                      |
|------------|-------------------------------|
| Frontend    | React, TypeScript, Vite        |
| Styling     | Tailwind CSS                   |
| Backend     | Python, Flask (REST API)       |
| Database    | SQLite                         |
| Deployment  | Docker, NGINX                  |

---

## 🧩 Role Capabilities

| Feature              | Student | Faculty | Admin |
|---------------------|--------|--------|-------|
| View Tasks          | ✅     | ✅     | ✅    |
| Create/Edit Tasks   | ❌     | ✅     | ✅    |
| View Analytics      | ✅     | ✅     | ✅    |
| Manage Users        | ❌     | ❌     | ✅    |

---

## 🏗 Software Design

The system follows a **Layered Client-Server Architecture**:

- **Presentation Layer** → Frontend UI (React)  
- **Application Layer** → Flask REST API  
- **Data Layer** → SQLite Database  
- **Deployment Layer** → Docker containers  

### Design Principles Applied

- **Low Coupling** → Independent modules communicate via APIs  
- **High Cohesion** → Each module handles a specific responsibility  
- **Separation of Concerns** → Clear division between UI, logic, and data layers  

---

## 🎨 Figma Prototype
- https://www.figma.com/make/rxUGHme1jQNwu41HFks2Ua/Web-Dashboard-UI-Flow?fullscreen=1&t=K5XGbS0Ip27M5K6a-1

## 📌 Version Control
-Version control was implemented using Git and GitHub with structured commits across development, Dockerization, and testing phases.

## Conclusion
-This project demonstrates a complete full-stack system with deployment, testing, and analytics capabilities, designed to improve academic task management and productivity.

## 🚀 Quick Start

### 🐳 Docker (Recommended)

```bash
bash docker-run.sh

Then open:

🌐 Frontend → http://localhost:3000
⚙️ Backend → http://localhost:5000
💻 Local Setup
Linux / macOS
bash run.sh
Windows
run.bat

Frontend:
http://localhost:5173

🔑 Demo Accounts
Role	Username	Password
Admin	admin	admin123
Faculty	prof_alex	prof123
Student	student1	student123

📁 Project Structure
project-root/
│
├── backend/                   ← Flask REST API
│   ├── app.py
│   ├── models.py
│   ├── routes/
│   ├── services/
│   ├── requirements.txt
│
├── frontend/                  ← React + Vite + TypeScript
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│
├── docker-compose.yml         ← Docker orchestration
├── docker-run.sh              ← Docker startup script
├── run.sh / run.bat           ← Local startup scripts
└── README.md
