from flask import Flask, jsonify, request

app = Flask(__name__)

error_msg = "ERROR: specify the model in the endpoint. eg /api/model"

@app.route("/")
def hello_world():
    return "<p>Use /api/<model> and specify a model to access endpoints!</p>"

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