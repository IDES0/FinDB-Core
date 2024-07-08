from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Joshd123@localhost:5432/findb'
db = SQLAlchemy(app)

class Stock(db.Model):
   __tablename__ = 'stock'

   id = db.Column(db.Integer, primary_key = True)

class Sector(db.Model):
   __tablename__ = 'sector'

   id = db.Column(db.Integer, primary_key = True)

class Index(db.Model):
   __tablename__ = 'index'

   id = db.Column(db.Integer, primary_key = True)

with app.app_context():
   db.create_all()