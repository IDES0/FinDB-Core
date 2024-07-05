import yfinance as yf
from datetime import date, timedelta
import pandas as pd
import os
import json
import yahooquery as yq
from create_db import app, db, ETF, Sector, Stock

# Helper functions
def get_name(ticker):
    return ticker.info.get('longName')

def get_price(ticker):
    return round(ticker.info.get('navPrice'), 2)

def get_total_assets(ticker):
    return format_number(ticker.info.get('totalAssets'))

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

def format_number(num):
    if num is None:
        return 'N/A'
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
        'full_name': name,
        'current_price': cur_price,
        'total_assets': total_assets,
        'top_sectors': top_sectors,
        'top_ten_holdings': top_stocks,
        'last_30_days_prices': past_prices
    }
    return index_data

def add_index_to_db(index_data):
    index = ETF.query.filter_by(ticker=index_data['ticker']).first()
    if index is None:
        index = ETF(**index_data)
    else:
        index.full_name = index_data['full_name']
        index.current_price = index_data['current_price']
        index.total_assets = index_data['total_assets']
        index.top_sectors = index_data['top_sectors']
        index.top_ten_holdings = index_data['top_ten_holdings']
        index.last_30_days_prices = index_data['last_30_days_prices']
    
    db.session.add(index)
    db.session.commit()

def main(symbols):
    with app.app_context():
        for symbol in symbols:
            index_data = get_index_data(symbol)
            add_index_to_db(index_data)

if __name__ == "__main__":
    symbols = ['SPY', 'VTI', 'QQQM']
    main(symbols)