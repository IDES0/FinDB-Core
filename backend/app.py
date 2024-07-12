from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy

from create_db import app, db, Stock, Index, Sector, index_to_sector, start_db
from sector_data import sector_data_run
from index_data import start_index
from stock_data import stock_data_run, populate_stock_data
from create_db import app, db, Stock, Index, Sector, index_to_sector, index_to_top_stocks
from sqlalchemy import desc

# app = Flask(__name__)
start_db()
sector_data_run()
start_index()
populate_stock_data()
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
        for sector in sectors:
            sector_dict = sector.toDict()

            # Fetch top stock for this sector
            top_stock = Stock.query.filter_by(sector_key=sector.sector_key)\
                                   .order_by(desc(Stock.market_cap))\
                                   .first()
            if top_stock:
                sector_dict['top_stock'] = top_stock.toDict()['ticker']

            # Fetch top index associated with this sector
            top_index = Index.query.join(index_to_sector, Index.ticker == index_to_sector.c.index_ticker)\
                                    .filter(index_to_sector.c.sector_key == sector.sector_key)\
                                    .order_by(desc(index_to_sector.c.percentage))\
                                    .first()
            if top_index:
                sector_dict['top_index'] = top_index.toDict()['ticker']

            # Top 10 stocks in market sector dominance
            top_10_stocks = Stock.query.filter_by(sector_key=sector.sector_key)\
                                       .order_by(desc(Stock.market_cap))\
                                       .limit(10)
            combined_market_cap = sum(stock.market_cap for stock in top_10_stocks)

            # Retrieve the total market cap of the entire sector
            total_market_cap = sector.market_cap

            # Calculate the ratio of combined market cap of the top 10 stocks to the total market cap of the sector
            if total_market_cap > 0:
                market_cap_ratio = combined_market_cap / total_market_cap
            else:
                market_cap_ratio = 0  # Handling division by zero if there's no market cap data available

            sector_dict['market_cap_ratio'] = market_cap_ratio
            response.append(sector_dict)
        return jsonify(response), 200
      sector = Sector.query.get(id)
      if sector:
        # Fetch top stocks in this sector sorted by market cap
        sector_dict = sector.toDict()

        top_stocks = Stock.query.filter_by(sector_key=sector.sector_key)\
                                    .order_by(desc(Stock.market_cap))\
                                    .limit(10).all()              
        sector_dict['top_stocks'] = [stock.toDict()['ticker'] for stock in top_stocks]
        # Join Index with index_to_sector and order by percentage
        top_indexes = Index.query.join(index_to_sector, Index.ticker == index_to_sector.c.index_ticker)\
                                      .filter(index_to_sector.c.sector_key.like(sector.sector_key))\
                                      .order_by(desc(index_to_sector.c.percentage))\
                                      .limit(10).all()
        sector_dict['top_indexes'] = [index.toDict()['ticker'] for index in top_indexes]

        return jsonify(sector_dict), 200
      else:
        return jsonify({"message": "Sector not found"}), 404
      
    elif name == "index":
      if id is None:
          indexes = Index.query.all()
          response = []
          for index in indexes: 
              r = index.toDict()
              del r['last_30_days_prices']

              response.append(r)
          return jsonify(response), 200
      else:
          # Query the index_to_sector table to get associated sectors for the given index id
          index = Index.query.get(id)
          if index:
              index_dict = index.toDict()
              del index_dict['last_30_days_prices']  # Remove unwanted field
              
              # Fetch sectors associated with the index
              sector_data = db.session.query(index_to_sector).filter_by(index_ticker=id).all()
              sectors = []
              top_sector = None
              max_percentage = 0
              for data in sector_data:
                  sector_dict = {
                      'sector_key': data.sector_key,
                      'percentage': data.percentage
                  }
                  sectors.append(sector_dict)
                  if data.percentage > max_percentage:
                      max_percentage = data.percentage
                      top_sector = sector_dict
              
              # Add sectors to the response
              index_dict['sectors'] = sectors
              
              # Add top sector to the response
              index_dict['top_sector'] = top_sector
              
              # Fetch top stocks associated with the index
              top_stocks_data = db.session.query(index_to_top_stocks).filter_by(index_ticker=id).all()
              top_stocks = []
              for data in top_stocks_data:
                  top_stocks.append({
                      'stock_ticker': data.stock_ticker,
                      'percentage': data.percentage
                  })
              
              # Add top stocks to the response
              index_dict['top_stocks'] = top_stocks

              return jsonify(index_dict), 200
          else:
              return jsonify({"message": "Index not found"}), 404
    








        
    elif name == "stock":
      if id is None:
        stocks = Stock.query.all()
        response = []
        for stock in stocks: 
          r = stock.toDict()
          del r['last_30_days_prices']
          response.append(r)
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