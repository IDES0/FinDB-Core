import yfinance as yf
from datetime import date, timedelta
import pandas as pd
import os
import json
import yahooquery as yq
from create_db import app, db, Stock, Sector

# Helper functions
def get_historical(ticker, days):
    start_date = date.today() - timedelta(days)
    end_date = date.today()
    data = ticker.history(start=start_date, end=end_date)
    data['Mid'] = ((data['Open'] + data['Close']) / 2).round(2)
    return data['Mid'].tolist()

def get_marketcap(ticker):
    return format_number(ticker.info.get('marketCap'))

def get_industry(ticker):
    return ticker.info.get('industry')

def get_name(ticker):
    return ticker.info.get('longName')

def get_price(ticker):
    return ticker.info['currentPrice']

def get_sector_key(ticker):
    return ticker.info['sectorKey']

def get_top_ten_index(ticker):
    fund_ownership = ticker.fund_ownership
    if fund_ownership is not None:
        top_ten = fund_ownership.head(10)
        top_ten_list = top_ten[['organization']].copy()
        top_ten_list = top_ten_list.to_dict('records')
        return top_ten_list
    else:
        return []

def format_number(num):
    if num >= 1e12:
        return f'{num / 1e12:.2f}T'
    elif num >= 1e9:
        return f'{num / 1e9:.2f}B'
    elif num >= 1e6:
        return f'{num / 1e6:.2f}M'
    elif num >= 1e3:
        return f'{num / 1e3:.2f}K'
    else:
        return str(num)

def get_stock_data(symbol):
    ticker = yf.Ticker(symbol)
    yq_ticker = yq.Ticker(symbol)
    past_prices = get_historical(ticker, 30)
    market_cap = get_marketcap(ticker)
    cur_price = get_price(ticker)
    industry = get_industry(ticker)
    name = get_name(ticker)
    sector_key = get_sector_key(ticker)
    top_10_indexes = get_top_ten_index(yq_ticker)
    
    stock_data = {
        'ticker': symbol,
        'full_name': name,
        'current_price': cur_price,
        'market_cap': market_cap,
        'industry': industry,
        'sector_key': sector_key,
        'top_10_indexes': top_10_indexes,
        'last_30_days_prices': past_prices
    }
    return stock_data

def add_stock_to_db(stock_data):
    sector_key = stock_data['sector_key']
    
    # Ensure the sector exists
    sector = Sector.query.filter_by(key=sector_key).first()
    if sector is None:
        sector = Sector(key=sector_key, name=sector_key)
        db.session.add(sector)
        db.session.commit()
    
    stock = Stock.query.filter_by(ticker=stock_data['ticker']).first()
    if stock is None:
        stock = Stock(**stock_data)
    else:
        stock.full_name = stock_data['full_name']
        stock.current_price = stock_data['current_price']
        stock.market_cap = stock_data['market_cap']
        stock.industry = stock_data['industry']
        stock.sector_key = stock_data['sector_key']
        stock.top_10_indexes = stock_data['top_10_indexes']
        stock.last_30_days_prices = stock_data['last_30_days_prices']
    
    db.session.add(stock)
    db.session.commit()

def main(symbols):
    with app.app_context():
        for symbol in symbols:
            stock_data = get_stock_data(symbol)
            add_stock_to_db(stock_data)

if __name__ == "__main__":
    symbols = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'GOOG', 'BRK-B', 'LLY', 'JPM']
    main(symbols)