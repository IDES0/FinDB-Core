import yfinance as yf
from datetime import date, timedelta
import pandas as pd
import os

# Gets the prices for past 30 days or whatever
def get_asset_prices(ticker, start_date, end_date):
    data = ticker.history(start=start_date, end=end_date)
    data['Mid'] = ((data['Open'] + data['Close']) / 2).round(2)
    return data['Mid'].tolist()

# Market Cap
def get_asset_marketcap(ticker):
    return ticker.info.get('marketCap')

# Sector
def get_sector_data(ticker):
    return ticker.info.get('industry')

# Full Name
def get_name(ticker):
    return ticker.info.get('longName')

# Current Stock Price
def get_current_price(ticker):
    current_price = ticker.history(period='1d')['Close'].iloc[0]
    return current_price

# Everything above are all HELPER methods

# Gets the stock data needed for one stock
def get_stock_data(symbol):
    ticker = yf.Ticker(symbol)
    date_today = date.today()
    prices = get_asset_prices(ticker, date_today - timedelta(days=30), date_today)
    market_cap = get_asset_marketcap(ticker)
    cur_price = get_current_price(ticker)
    sector = get_sector_data(ticker)
    name = get_name(ticker)
    
    row = {
        'Ticker': symbol,
        'Full Name': name,
        'Last 30 Days Prices': prices,
        'Current Price': cur_price,
        'Market Cap': market_cap,
        'Sector': sector
    }
    return row

# Just for testing, will be put onto flask api later
def main(symbols):
    all_data = []

    for symbol in symbols:
        row = get_stock_data(symbol)
        all_data.append(row)

    combined_data = pd.DataFrame(all_data)
    output_dir = 'backend/csv'
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, 'stock_data.csv')
    combined_data.to_csv(output_path, index=False)

if __name__ == "__main__":
    symbols = ['AAPL', 'NVDA', 'MSFT']
    main(symbols)
