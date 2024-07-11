#sector_data.py
import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import os
from create_db import app, db, Sector, Industry, Stock, sector_to_top_stocks
from io import StringIO


BASE_URL = "https://finance.yahoo.com/sectors/"
NAME_KEY_PAIR = {
    "Technology": "technology",
    "Financial Services":"financial-services",
    "Healthcare": "healthcare",
    "Consumer Cyclical": "consumer-cyclical",
    "Communication Services": "communication-services",
    "Industrials": "industrials",
    "Consumer Defensive": "consumer-defensive",
    "Energy": "energy",
    "Basic Materials": "basic-materials",
    "Real Estate": "real-estate",
    "Utilities": "utilities"
}


def format_number(num):
    if num is None:
        return None
    if isinstance(num, float): #wack number is already formated
        return num
    if num.endswith('T'):
        return float(num[:-1]) * 1e12
    elif num.endswith('B'):
        return float(num[:-1]) * 1e9
    elif num.endswith('M'):
        return float(num[:-1]) * 1e6
    elif num.endswith('K'):
        return float(num[:-1]) * 1e3
    else:
        return float(num)

def scrape_industry(soup):
    industries = []
    industry_section = soup.find('div', class_="container svelte-152j1g3", attrs={"data-testid": "sector-picker"})
    if industry_section:
        industry_rows = industry_section.find_all('div', class_="itm svelte-5qjwyh")
        for row in industry_rows:
            industry_name = row.get('data-value', '')
            industry_key = row.get('data-key', '')
            if industry_key:
                industries.append({
                    "name": industry_name,
                    "key": industry_key
                })
    return industries

def scrape_etf_opportunities(soup):
    etf_opportunities = []
    etf_section = soup.find('div', class_="table-section-container svelte-1dauhxv")
    if etf_section:
        table = etf_section.find('table')
        if table:
            df = pd.read_html(StringIO(str(table)))[0]
            etf_opportunities = df.to_dict(orient='records')
    return etf_opportunities

def scrape_sector_data(sector_url):
    response = requests.get(sector_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    market_cap_div = soup.find('div', class_="value svelte-e2k9sg")
    if market_cap_div:
        market_cap = format_number(market_cap_div.get_text())
    else:
        market_cap = None
    
    table_section = soup.find('section', class_="container svelte-ekgvwx", attrs={"data-testid": "largest-companies"})
    table_data = []
    
    if table_section:
        table = table_section.find('table')
        if table:
            df = pd.read_html(StringIO(str(table)))[0]
            if "1Y Target Est." in df.columns and "Avg. Analyst Rating" in df.columns:
                df = df.drop(columns=["1Y Target Est.", "Avg. Analyst Rating"])
            table_data = df.to_dict(orient='records')
            for row in table_data:
                name_parts = row["Name"].split(' ', 1)
                if len(name_parts) == 2:
                    ticker, name = name_parts
                    row["Name"] = name
                    row["Ticker"] = ticker
    
    industries = scrape_industry(soup)
    etf_opportunities = scrape_etf_opportunities(soup)
    
    data = {
        "market_cap": market_cap,
        "largest_companies": table_data,
        "industries": industries,
        "etf_opportunities": etf_opportunities
    }
    
    return data

def add_sector_to_db(sector_key, sector_name, sector_data):
    sector = Sector.query.filter_by(sector_key=sector_key).first()
    market_cap = format_number(sector_data["market_cap"]) if isinstance(sector_data["market_cap"], str) else sector_data["market_cap"]

    if sector is None:
        sector = Sector(
            sector_key=sector_key,
            name=sector_name,
            market_cap=market_cap
        )
        db.session.add(sector)
    else:
        sector.market_cap = market_cap

    for industry_data in sector_data["industries"]:
        industry = Industry.query.filter_by(industry_key=industry_data['key']).first()
        if industry is None:
            industry = Industry(industry_key=industry_data['key'], name=industry_data['name'])
            db.session.add(industry)
        if industry not in sector.industries:
            sector.industries.append(industry)

    for stock_data in sector_data["largest_companies"]:
        stock = Stock.query.filter_by(ticker=stock_data['Ticker']).first()
        if stock is None:
            stock = Stock(
                ticker=stock_data['Ticker'],
                name=stock_data['Name'],
                current_price=stock_data['Last Price'],
                market_cap=format_number(stock_data['Market Cap']) if isinstance(stock_data['Market Cap'], str) else stock_data['Market Cap'],
                sector_key=sector.sector_key,
                last_30_days_prices=[]
            )
            db.session.add(stock)
        if stock not in sector.top_stocks:
            sector.top_stocks.append(stock)

        percentage = float(stock_data['Market Weight'].strip('%'))
        exists = db.session.query(sector_to_top_stocks).filter_by(sector_key=sector.sector_key, stock_ticker=stock.ticker).first()
        if not exists:
            db.session.execute(sector_to_top_stocks.insert().values(sector_key=sector.sector_key, stock_ticker=stock.ticker, percentage=percentage))

    db.session.commit()


def sector_data_run():
    with app.app_context():
        for name, key in NAME_KEY_PAIR.items():
                sector_data = scrape_sector_data(BASE_URL+key)
                add_sector_to_db(key, name, sector_data)
        return sector_data

if __name__ == "__main__":
    sector_data_run()