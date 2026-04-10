@echo off
REM AcademiQ - Smart Academic Task System
REM ONE-COMMAND startup for Windows
REM Usage: run.bat

echo.
echo ============================================
echo    AcademiQ -- Smart Academic Task System
echo ============================================
echo.

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (echo [ERROR] Python not found. Install Python 3.9+ & exit /b 1)
echo [OK] Python found

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (echo [ERROR] Node.js not found. Install Node.js 18+ & exit /b 1)
echo [OK] Node.js found

REM Backend setup
echo.
echo [Backend] Setting up virtual environment...
cd backend
if not exist venv (python -m venv venv)
call venv\Scripts\activate.bat
pip install -q -r requirements.txt
echo [OK] Backend ready

REM Frontend setup
echo.
echo [Frontend] Installing Node packages...
cd ..\frontend
if not exist node_modules (npm install --silent)
echo [OK] Frontend ready

REM Start backend in new window
echo.
echo [Backend] Starting Flask on port 5000...
cd ..\backend
start "AcademiQ Backend" cmd /k "venv\Scripts\activate.bat && python app.py"

timeout /t 2 /nobreak >nul

REM Start frontend in new window
echo [Frontend] Starting Vite on port 5173...
cd ..\frontend
start "AcademiQ Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:5173

echo.
echo ============================================
echo   AcademiQ is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo.
echo   Demo: admin/admin123  prof_alex/prof123  student1/student123
echo   Close the backend/frontend windows to stop.
echo ============================================
