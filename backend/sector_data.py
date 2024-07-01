import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import os

BASE_SECTOR_URL = "https://finance.yahoo.com/sectors/"
SECTOR_URL = {
    "Technology": BASE_SECTOR_URL + "technology",
    "Financial Services": BASE_SECTOR_URL + "financial-services",
    "Healthcare": BASE_SECTOR_URL + "healthcare",
    "Consumer Cyclical": BASE_SECTOR_URL + "consumer-cyclical",
    "Communication Services": BASE_SECTOR_URL + "communication-services",
    "Industrials": BASE_SECTOR_URL + "industrials",
    "Consumer Defensive": BASE_SECTOR_URL + "consumer-defensive",
    "Energy": BASE_SECTOR_URL + "energy",
    "Basic Materials": BASE_SECTOR_URL + "basic-materials",
    "Real Estate": BASE_SECTOR_URL + "real-estate",
    "Utilities": BASE_SECTOR_URL + "utilities"
}

# Scrapes the smaller industry list table
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

# Scrapes ETFs
def scrape_etf_opportunities(soup):
    etf_opportunities = []
    etf_section = soup.find('div', class_="table-section-container svelte-1dauhxv")
    
    if etf_section:
        table = etf_section.find('table')
        if table:
            df = pd.read_html(str(table))[0]
            etf_opportunities = df.to_dict(orient='records')
    
    return etf_opportunities

# Scrapes all the sector info
def scrape_sector_data(sector_url):
    response = requests.get(sector_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    market_cap_div = soup.find('div', class_="value svelte-e2k9sg")
    if market_cap_div:
        market_cap = market_cap_div.get_text()
    else:
        market_cap = None
    
    table_section = soup.find('section', class_="container svelte-ekgvwx", attrs={"data-testid": "largest-companies"})
    table_data = []
    
    # Reads each of the tables and grabs the items
    if table_section:
        table = table_section.find('table')
        if table:
            df = pd.read_html(str(table))[0]
            if "1Y Target Est." in df.columns and "Avg. Analyst Rating" in df.columns:
                df = df.drop(columns=["1Y Target Est.", "Avg. Analyst Rating"])
            table_data = df.to_dict(orient='records')
            
            # splitting ticker and name from each other, wont format correctly yet
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

def main():
    all_data = {}
    
    for sector, url in SECTOR_URL.items():
        sector_info = scrape_sector_data(url)
        all_data[sector] = sector_info
    
    output_dir = 'backend/json'
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, 'sector_data.json')
    
    with open(output_file, 'w') as json_file:
        json.dump(all_data, json_file, indent=4)

if __name__ == "__main__":
    main()
