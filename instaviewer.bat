@echo off
cd src

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR : Node.js / npm n'est pas installe ou n'est pas dans le PATH.
    echo Telecharge Node.js sur https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Premiere execution detectee, installation des dependances...
    call npm install
    if %errorlevel% neq 0 (
        echo Erreur lors de l'installation des dependances.
        pause
        exit /b 1
    )
    echo Installation terminee.
    echo.
)

cd ../
node src/server
pause