@echo off
echo Starting DUKA E-commerce Project...

:: Start Backend
echo Starting Backend on port 5000...
start cmd /k "cd backend && node src/server.js"

:: Start Frontend
echo Starting Frontend on port 3000...
start cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting in new windows!
echo Please make sure your XAMPP MySQL is running.
echo.
pause
