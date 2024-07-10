import yfinance as yf
from datetime import date, timedelta
import pandas as pd
import yahooquery as yq
from create_db import app, db, Index, Sector, Stock, index_to_top_stocks

# Helper functions
def get_name(ticker):
    return ticker.info.get('longName')

def get_price(ticker):
    return round(ticker.info.get('navPrice'), 2)

def get_total_assets(ticker):
    return ticker.info.get('totalAssets')

def get_historical(ticker, days):
    start_date = date.today() - timedelta(days)
    end_date = date.today()
    data = ticker.history(start=start_date, end=end_date)
    if 'Open' in data.columns and 'Close' in data.columns:
        data['Mid'] = round(((data['Open'] + data['Close']) / 2), 2)
        return data['Mid'].tolist()
    else:
        return []

def get_top_ten_stock(ticker):
    holdings = ticker.fund_top_holdings
    holdings_list = []
    for i in range(len(holdings)):
        holding = {
            'symbol': holdings.iloc[i]['symbol'],
            'holdingName': holdings.iloc[i]['holdingName'],
            'holdingPercent': round(holdings.iloc[i]['holdingPercent'] * 100, 2)
        }
        holdings_list.append(holding)
    return holdings_list

def get_top_sectors(ticker):
    sectors = ticker.fund_sector_weightings
    sectors_list = []
    for sector, weight in sectors.items():
        sectors_list.append({'sector': sector, 'weight': weight})
    return sectors_list

def get_index_data(symbol):
    yq_ticker = yq.Ticker(symbol)
    yf_ticker = yf.Ticker(symbol)
    past_prices = get_historical(yf_ticker, 30)
    total_assets = get_total_assets(yf_ticker)
    cur_price = get_price(yf_ticker)
    name = get_name(yf_ticker)
    top_stocks = get_top_ten_stock(yq_ticker)
    top_sectors = get_top_sectors(yq_ticker)
    
    index_data = {
        'ticker': symbol,
        'name': name,
        'nav': cur_price,
        'total_asset': total_assets,
        'last_30_days_prices': past_prices,
        'top_ten_holdings': top_stocks,
        'top_sectors': top_sectors
    }
    return index_data

def add_index_to_db(index_data):
    index = Index.query.filter_by(ticker=index_data['ticker']).first()
    if index is None:
        index = Index(
            ticker=index_data['ticker'],
            name=index_data['name'],
            nav=index_data['nav'],
            total_asset=index_data['total_asset'],
            last_30_days_prices=index_data['last_30_days_prices']
        )
        db.session.add(index)
        db.session.commit()

    for stock_data in index_data['top_ten_holdings']:
        stock = Stock.query.filter_by(ticker=stock_data['symbol']).first()
        if stock is None:
            stock = Stock(
                ticker=stock_data['symbol'],
                name=stock_data['holdingName']
            )
            db.session.add(stock)
            db.session.commit()
        exists = db.session.query(index_to_top_stocks).filter_by(index_ticker=index.ticker, stock_ticker=stock.ticker).first()
        if not exists:
            percentage = float(stock_data['holdingPercent']) #weird float thingy idk why its needed here
            db.session.execute(index_to_top_stocks.insert().values(index_ticker=index.ticker, stock_ticker=stock.ticker, percentage=percentage))

    for sector_data in index_data['top_sectors']:
        sector = Sector.query.filter_by(sector_key=sector_data['sector']).first()
        if sector:
            if sector not in index.sectors:
                index.sectors.append(sector)

    db.session.commit()


def main(symbols):
    with app.app_context():
        for symbol in symbols:
            index_data = get_index_data(symbol)
            add_index_to_db(index_data)

if __name__ == "__main__":
    symbols = ['SPY', 'VTI', 'QQQM', 'SOXX']
    main(symbols)