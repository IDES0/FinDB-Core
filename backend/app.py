from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from findb.backend.create_db import app, db, Stock, Index, Sector

# app = Flask(__name__)

error_msg = "ERROR: specify the model in the endpoint. eg /api/model"

@app.route('/dbtest')
def test_db():
   Stock()

   return {"message": "test"}, 200

@app.route("/")
@app.route("/index.html")
@app.route("/index.html#")
def index():
    return render_template('index.html')
    # return "<p>Use /api/<model> and specify a model to access endpoints!</p>"

@app.route("/about.html")
def about():
   return render_template('about.html')

@app.route("/stock-model.html")
def stock():
   return render_template('stock-model.html')

@app.route("/sector-model.html")
def sector():
   return render_template('sector-model.html')

@app.route("/index-model.html")
def index_m():
   return render_template('index-model.html')

# GET
@app.get("/api/<name>")
def get_resource(name):
    if name == "sector":
      return f"Get {name} received"
    elif name == "index":
      return f"Get {name} received" 
    elif name == "stock":
      return f"Get {name} received" 
    else:
      return error_msg


# POST
@app.post("/api/<name>")
def post_resource(name):
    if name == "sector":
      return f"Post {request.get_json()} received to: {name}"
    elif name == "index":
      return f"Post {request.get_json()} received to: {name}" 
    elif name == "stock":
      return f"Post {request.get_json()} received to: {name}" 
    else:
      return error_msg

# PUT
@app.put("/api/<name>")
def put_resource(name):
    if name == "sector":
      return f"Put {request.get_json()} received to: {name}"
    elif name == "index":
      return f"Put {request.get_json()} received to: {name}" 
    elif name == "stock":
      return f"Put {request.get_json()} received to: {name}" 
    else:
      return error_msg



# DELETE
@app.delete("/api/<name>")
def delete_resource(name):
    if name == "sector":
      return f"Delete {name} received"
    elif name == "index":
      return f"Delete {name} received" 
    elif name == "stock":
      return f"Delete {name} received" 
    else:
      return error_msg

# host='0.0.0.0' to make the server publicly available. 
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')