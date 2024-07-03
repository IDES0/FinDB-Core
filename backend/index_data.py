import yfinance as yf
from datetime import date, timedelta
import pandas as pd
import os
import json
import yahooquery as yq

# Full Name
def get_name(ticker):
    return ticker.info.get('longName')

# Current Stock Price
def get_price(ticker):
    return round(ticker.info.get('navPrice'), 2)

# Market Cap/Total Assets
def get_total_assets(ticker):
    return format_number(ticker.info.get('totalAssets'))

# Gets the prices for past days
def get_historical(ticker, days):
    start_date = date.today() - timedelta(days)
    end_date = date.today()
    data = ticker.history(start=start_date, end=end_date)
    if 'Open' in data.columns and 'Close' in data.columns:
        data['Mid'] = round(((data['Open'] + data['Close']) / 2), 2)
        return data['Mid'].tolist()
    else:
        return []

# Top ten holdings
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

# Top sectors
def get_top_sectors(ticker):
    sectors = ticker.fund_sector_weightings
    return sectors.to_dict()

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

# Gets the stock data needed for one stock
def get_index_data(symbol):
    yq_ticker = yq.Ticker(symbol)
    yf_ticker = yf.Ticker(symbol)
    past_prices = get_historical(yf_ticker, 30)
    total_assets = get_total_assets(yf_ticker)
    cur_price = get_price(yf_ticker)
    name = get_name(yf_ticker)
    top_stocks = get_top_ten_stock(yq_ticker)
    top_sectors = get_top_sectors(yq_ticker)
    row = {
        'Ticker': symbol,
        'Full Name': name,
        'Current Price': cur_price,
        'Total Assets': total_assets,
        'Top Sectors': top_sectors,
        'Top Ten Holdings': top_stocks,
        'Last 30 Days Prices': past_prices,
    }
    return row

# Just for testing, will be put onto flask api later
def main(symbols):
    all_data = []
    for symbol in symbols:
        row = get_index_data(symbol)
        all_data.append(row)

    output_dir = 'backend/json'
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, 'index_data.json')
    with open(output_path, 'w') as json_file:
        json.dump(all_data, json_file, indent=4)

if __name__ == "__main__":
    symbols = ['SPY', 'VTI', 'QQQM']
    main(symbols)
