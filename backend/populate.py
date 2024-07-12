from create_db import db, Stock, app
from stock_data import stock_data_run

def populate_stock_data():
    with app.app_context():
        tickers = [stock.ticker for stock in Stock.query.all()]
        print(tickers)



populate_stock_data()
