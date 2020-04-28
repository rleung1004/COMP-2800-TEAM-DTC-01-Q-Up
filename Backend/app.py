from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import urllib
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
from static.model.Model import Model

app = Flask(__name__)
params = urllib.parse.quote_plus(
    "DRIVER={ODBC Driver 17 for SQL Server};SERVER=192.99.144.152;DATABASE=?????;"  # databasename instead of ???
    "UID=????;PWD=????")  # username and password instead of ????
app.config['SQLALCHEMY_DATABASE_URI'] = "mssql+pyodbc:///?odbc_connect=%s" % params
db = SQLAlchemy(app)

engine = create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)

Base = automap_base()
Base.prepare(engine, reflect=True)

session = Session(engine)
model = Model(Base, session, db)

## Routes of the application

@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run(debug=True)
