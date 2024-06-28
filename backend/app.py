from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Use /api/ and an identifier to access endpoints!</p>"

# GET
@app.get("/api/<name>")
def get_resource(name):
    return f"Get received to: {name}"


# POST
@app.post("/api/<name>")
def post_resource(name):
    return f"Post {request.get_json()} received to: {name}"

# PUT
@app.put("/api/<name>")
def put_resource(name):
    return f"Put {request.get_json()} received to: {name}"


# DELETE
@app.delete("/api/<name>")
def delete_resource(name):
    return f"Delete received to: {name}"


if __name__ == "__main__":
    app.run(debug=True)