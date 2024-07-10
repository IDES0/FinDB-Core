from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from create_db import app, db, Stock, Index, Sector

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

# GET ALL
@app.get("/api/<name>/")
@app.get("/api/<name>/<id>")
def get_resource(name, id=None):
    if name == "sector":
      if id is None:
        sectors = Sector.query.all()
        response = []
        for sector in sectors: response.append(sector.toDict())
        return jsonify(response), 200
      #get by id
      response = db.session.query(Sector).get(id)
      return jsonify(response.toDict()), 200
    
    elif name == "index":
      if id is None:
        indexes = Index.query.all()
        response = []
        for index in indexes: response.append(index.toDict())
        return jsonify(response), 200
      response = db.session.query(Index).get(id)
      return jsonify(response.toDict()), 200
      
      
    elif name == "stock":
      if id is None:
        stocks = Stock.query.all()
        response = []
        for stock in stocks: response.append(stock.toDict())
        return jsonify(response), 200
      response = db.session.query(Stock).get(id).toDict()
      return jsonify(response), 200
      
    else:
      return jsonify({"message": error_msg}), 400



# POST
'''
'''
@app.post("/api/<name>/")
def post_resource(name):
    form = request.form.to_dict()
    if name == "sector":
      new_sector = Sector(
                                key               = form['key'],
                                name              = form['name'],
                                market_cap        = form['market_cap'],
                                largest_companies = form['largest_companies'],
                                industries        = form['industries'],
                                etf_opportunities = form['etf_opportunies'],
                                )
      db.session.add(new_sector)
      db.session.commit()
      response = Sector.query.get(form['key'])
      return jsonify(response.toDict()), 200
    elif name == "index":
      new_index = Index(
                                ticker               = form['ticker'],
                                full_name            = form['full_name'],
                                current_price        = form['current_price'],
                                total_assets         = form['total_assets'],
                                last_30_days_prices  = form['last_30_days_prices'],
                                )
      db.session.add(new_index)
      db.session.commit()
      response = Index.query.get(form['ticker'])
      return jsonify(response.toDict()), 200
    elif name == "stock":
      new_stock = Stock(
                                ticker               = form['ticker'],
                                full_name            = form['full_name'],
                                current_price        = form['current_price'],
                                market_cap           = form['market_cap'],
                                industry             = form['industry'],
                                sector_key           = form['sector_key'],
                                top_10_indexes       = form['top_10_indexes'],
                                last_30_days_prices  = form['last_30_days_prices'],
                                )
      db.session.add(new_stock)
      db.session.commit()
      response = Stock.query.get(form['ticker'])
      return jsonify(response.toDict()), 200
    else:
      return jsonify({"message": error_msg}), 400

# PUT
@app.put("/api/<name>/<id>")
def put_resource(name,id):
    if id is None:
      return jsonify({'message': "ERROR: Please specify an identifier!"}), 400  
    form = request.form.to_dict()
    if name == "sector":
      up_sector = Sector.query.get(id)
      # update with new JSON 
      up_sector.key               = form['key'],
      up_sector.name              = form['name'],
      up_sector.market_cap        = form['market_cap'],
      up_sector.largest_companies = form['largest_companies'],
      up_sector.industries        = form['industries'],
      up_sector.etf_opportunities = form['etf_opportunies']
      db.session.commit()
      response = Sector.query.get(id)
      return jsonify(response.toDict()), 200
    elif name == "index":
      up_index = Index.query.get(id)
      # update with new JSON 
      up_index.ticker               = form['ticker'],
      up_index.full_name            = form['full_name'],
      up_index.current_price        = form['current_price'],
      up_index.total_assets         = form['total_assets'],
      up_index.last_30_days_prices  = form['last_30_days_prices']
      db.session.commit()
      response = Index.query.get(id)
      return jsonify(response.toDict()), 200
    elif name == "stock":
      up_stock = Stock.query.get(id)
      # update with new JSON 
      up_stock.ticker               = form['ticker'],
      up_stock.full_name            = form['full_name'],
      up_stock.current_price        = form['current_price'],
      up_stock.market_cap           = form['market_cap'],
      up_stock.industry             = form['industry'],
      up_stock.sector_key           = form['sector_key'],
      up_stock.top_10_indexes       = form['top_10_indexes'],
      up_stock.last_30_days_prices  = form['last_30_days_prices']
      db.session.commit()
      response = Stock.query.get(id)
      return jsonify(response.toDict()), 200 
    else:
      return jsonify({'message': error_msg}), 400



# DELETE
@app.delete("/api/<name>/<id>")
def delete_resource(name,id):
  if id is None:
    return jsonify({'message': "ERROR: Please specify an identifier!"}), 400
  if name == "sector":
    Sector.query.filter_by(key=id).delete()
    db.session.commit()
    return jsonify({"message": f"Sector {id} deleted."}), 200
  elif name == "index":
    Index.query.filter_by(ticker=id).delete()
    db.session.commit() 
    return jsonify({"message": f"Index {id} deleted."}), 200

  elif name == "stock":
    Stock.query.filter_by(ticker=id).delete()
    db.session.commit()
    return jsonify({"message": f"Stock {id} deleted."}), 200
  else:
    return jsonify({'message':error_msg}), 400

# host='0.0.0.0' to make the server publicly available. 
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')