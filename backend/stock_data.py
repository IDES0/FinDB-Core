import yfinance as yf
from datetime import date, timedelta
import pandas as pd
import os
# Gets the prices for past 30 days or wateev
def get_asset_prices(symbol, start_date, end_date):
    data = yf.download(symbol, start=start_date, end=end_date)
    data['Mid'] = ((data['Open'] + data['Close']) / 2).round(2)
    return data['Mid'].tolist()

# Market Cap
def get_asset_marketcap(symbol):
    ticker = yf.Ticker(symbol)
    return ticker.info['marketCap']

# Sector
def get_sector_data(symbol):
    ticker = yf.Ticker(symbol)
    return ticker.info['industry']

# Full Name
def get_name(symbol):
    ticker = yf.Ticker(symbol)
    return ticker.info['longName']

# Current Stock Price
def get_current_price(symbol):
    ticker = yf.Ticker(symbol)
    current_price = ticker.history(period='1d')['Close'].iloc[0]
    return current_price

# in the future, might make it so that you only have to call yf.Ticker once,
# and it sorts it out using pandas
# Just for testing, will be put onto flask api later
def main(symbols):
    date_today = date.today()
    all_data = []

    for symbol in symbols:
        prices = get_asset_prices(symbol, date_today - timedelta(days=30), date_today)
        market_cap = get_asset_marketcap(symbol)
        cur_price = get_current_price(symbol)
        sector = get_sector_data(symbol)
        name = get_name(symbol)
        
        row = {}
        row['Ticker'] = symbol
        row['Full Name'] = name
        row['Last 30 Days Prices'] = prices
        row['Current Price'] = cur_price
        row['Market Cap'] = market_cap
        row['Sector'] = sector

        all_data.append(row)

    combined_data = pd.DataFrame(all_data)
    output_dir = 'backend/csv'
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, 'stock_data.csv')
    combined_data.to_csv(output_path, index=False)

if __name__ == "__main__":
    symbols = ['AAPL', 'NVDA', 'MSFT']
    main(symbols)
