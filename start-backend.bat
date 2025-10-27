@echo off
echo ========================================
echo  Starting CST Audit Backend (Port 5000)
echo ========================================
echo.

cd backend

echo Checking if uploads folder exists...
if not exist uploads\evidence (
    echo Creating uploads folder...
    mkdir uploads\evidence
)

echo.
echo Starting backend server...
echo Keep this window open!
echo.

npm run dev
