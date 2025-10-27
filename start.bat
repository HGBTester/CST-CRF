@echo off
echo ========================================
echo CST Audit System - Startup Script
echo ========================================
echo.

echo Starting MongoDB migration...
cd backend
node scripts/migrate-to-database.js
if %ERRORLEVEL% NEQ 0 (
    echo Migration failed! Check your MongoDB connection.
    pause
    exit /b 1
)
echo.

echo Starting backend server...
start "CST Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
echo.

echo Starting frontend...
cd ..
start "CST Frontend" cmd /k "npm run dev"
echo.

echo ========================================
echo System started successfully!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to stop all services...
pause >nul

taskkill /FI "WINDOWTITLE eq CST Backend*" /T /F
taskkill /FI "WINDOWTITLE eq CST Frontend*" /T /F
