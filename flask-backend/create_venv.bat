@echo off
dir
py -m venv venv
CALL venv\Scripts\activate
python -m pip install flask pyYAML pandas python-dotenv
cmd /k
