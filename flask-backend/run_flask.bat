@REM @echo off
CALL venv\Scripts\activate
start "" http://127.0.0.1:5000/
set FLASK_APP=temp.py
set FLASK_ENV=development
flask run
pause
