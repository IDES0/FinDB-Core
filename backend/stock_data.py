import yfinance as yf
from datetime import date, timedelta
import pandas as pd
import os
import json
import yahooquery as yq

# Gets the prices for past days
def get_historical(ticker, days):
    start_date = date.today() - timedelta(days)
    end_date =  date.today()
    data = ticker.history(start=start_date, end=end_date)
    data['Mid'] = ((data['Open'] + data['Close']) / 2).round(2)
    return data['Mid'].tolist()

# Market Cap
def get_marketcap(ticker):
    return format_number(ticker.info.get('marketCap'))

# Sector
def get_industry(ticker):
    return ticker.info.get('industry')

# Full Name
def get_name(ticker):
    return ticker.info.get('longName')

# Current Stock Price
def get_price(ticker):
    return ticker.info['currentPrice']

def get_industry(ticker):
    return ticker.info['industry']

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

def get_name_from_ticker(ticker):
    return ticker.info.get['ticker']

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
    
# Gets the stock data needed for one stock
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
    
    row = {
        'Ticker': symbol,
        'Full Name': name,
        'Current Price': cur_price,
        'Market Cap': market_cap,
        'Industry': industry,
        'Sector Key': sector_key,
        'Top 10 Indexes': top_10_indexes,
        'Last 30 Days Prices': past_prices
    }
    return row

# Just for testing, will be put onto flask api later
def main(symbols):
    all_data = []

    for symbol in symbols:
        row = get_stock_data(symbol)
        all_data.append(row)

    output_dir = 'backend/json'
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, 'stock_data.json')
    with open(output_path, 'w') as json_file:
        json.dump(all_data, json_file, indent=4)

if __name__ == "__main__":
    symbols = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'GOOG', 'BRK-B', 'LLY', 'JPM']
    main(symbols)
