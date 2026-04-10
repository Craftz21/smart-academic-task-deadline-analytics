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
🌐 API Endpoints
Method	Endpoint	Description
POST	/login	User login
GET	/tasks	Fetch tasks
POST	/tasks	Create task
PUT	/tasks/:id	Update task
GET	/analytics	Analytics data
GET	/courses	Course list
📊 Analytics Features
Task summary (completed, pending, overdue)
Priority distribution
Weekly workload charts
Course-wise task breakdown
Upcoming deadlines
Workload score calculation
🐳 Docker Architecture
Backend → Flask container
Frontend → Built with Vite and served via NGINX
Docker Compose → service orchestration
🧪 Testing

The system was tested using:

✔ Integration Testing

Verified frontend-backend API communication (e.g., login request returning HTTP 200).

✔ Regression Testing

Ensured existing features such as dashboard, tasks, and analytics function correctly after system updates.

✔ Mutation Testing

Modified authentication logic intentionally to test system robustness and error handling.

⚙️ Tech Stack
Layer	Technology
Frontend	React, TypeScript, Vite
Styling	Tailwind CSS
Backend	Python, Flask
Database	SQLite
Deployment	Docker, NGINX

🧩 Role Capabilities
Feature	Student	Faculty	Admin
View tasks	✅	✅	✅
Create/edit tasks	❌	✅	✅
Analytics	✅	✅	✅
Manage users	❌	❌	✅
🏗 Software Design

The system follows a Layered Client-Server Architecture:

Presentation Layer → Frontend UI
Application Layer → Flask API
Data Layer → Database
Deployment Layer → Docker

Design principles:

Low coupling
High cohesion
Separation of concerns
🎨 Figma Prototype

https://www.figma.com/make/rxUGHme1jQNwu41HFks2Ua/Web-Dashboard-UI-Flow?fullscreen=1&t=K5XGbS0Ip27M5K6a-1

📌 Version Control

Version control was implemented using Git and GitHub with structured commits across development, Dockerization, and testing phases.

❤️ Conclusion

This project demonstrates a complete full-stack system with deployment, testing, and analytics capabilities, designed to improve academic task management and productivity.