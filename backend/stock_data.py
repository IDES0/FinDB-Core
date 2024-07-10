import yfinance as yf
import yahooquery as yq
from datetime import date, timedelta
from create_db import app, db, Stock, Sector, Index, Industry

def get_historical(ticker, days):
    start_date = date.today() - timedelta(days=days)
    end_date = date.today()
    data = ticker.history(start=start_date, end=end_date)
    data['Mid'] = ((data['Open'] + data['Close']) / 2).round(2)
    return data['Mid'].tolist()

def get_top_ten_index(ticker):
    try:
        fund_ownership = ticker.fund_ownership
        if not fund_ownership.empty:
            top_ten = fund_ownership.head(10)['organization'].tolist()
            return top_ten
        return []
    except Exception as e:
        print(f"Error {ticker.ticker}: {e}")
        return []

def get_stock_data(symbol):
    ticker = yf.Ticker(symbol)
    yq_ticker = yq.Ticker(symbol)
    past_prices = get_historical(ticker, 30)
    stock_data = {
        'ticker': symbol,
        'name': ticker.info.get('longName'),
        'current_price': ticker.info.get('currentPrice'),
        'market_cap': ticker.info.get('marketCap'),
        'industry': ticker.info.get('industryKey'),
        'sector_key': ticker.info.get('sectorKey'),
        'last_30_days_prices': past_prices,
        'top_10_indexes': get_top_ten_index(yq_ticker)
    }
    return stock_data

def add_stock_to_db(stock_data):
    sector_key = stock_data['sector_key']
    sector = Sector.query.filter_by(sector_key=sector_key).first()
    if sector is None:
        sector = Sector(sector_key=sector_key, name=sector_key)
        db.session.add(sector)
        db.session.commit()
    
    industry = Industry.query.filter_by(industry_key=stock_data['industry']).first()
    if industry is None:
        industry = Industry(industry_key=stock_data['industry'], name=stock_data['industry'])
        db.session.add(industry)
        db.session.commit()

    stock = Stock.query.filter_by(ticker=stock_data['ticker']).first()
    if stock is None:
        stock = Stock(
            ticker=stock_data['ticker'],
            name=stock_data['name'],
            current_price=stock_data['current_price'],
            market_cap=stock_data['market_cap'],
            industry_key=industry.industry_key,
            sector_key=sector.sector_key,
            last_30_days_prices=stock_data['last_30_days_prices']
        )
    else:
        stock.name = stock_data['name']
        stock.current_price = stock_data['current_price']
        stock.market_cap = stock_data['market_cap']
        stock.industry_key = industry.industry_key
        stock.sector_key = sector.sector_key
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