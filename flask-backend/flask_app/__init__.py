"""
The script above simply creates the application object as an instance of class Flask imported from the flask package. The __name__ variable passed to the Flask class is a Python predefined variable, which is set to the name of the module in which it is used. Flask uses the location of the module passed here as a starting point when it needs to load associated resources such as template files
"""
from flask import Flask

app = Flask(__name__)

# from app import routes
import flask_app.routes
