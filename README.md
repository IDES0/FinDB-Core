# FinDB Core: Comprehensive Financial Data Storage

**Repository**: [Financial Database (FinDB)](https://github.com/IDES0/Financial-Database-FINDB-0)

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Usage](#usage)
5. [API Integration](#api-integration)
6. [Contributing](#contributing)
7. [License](#license)

---

## Overview
FinDB is a Flask-based financial database application designed to store, analyze, and search financial data. This project leverages various tools and libraries to integrate multi-relational data tables that manage information on stocks, industries, sectors, and indexes. Real-time financial data is sourced through **Yahoo Finance** and **YahooQuery** APIs, allowing for up-to-date data retrieval and search functionality.

## Features
- **Stock Data Management**: Efficient storage and management of stock information, including real-time pricing, market cap, and performance metrics.
- **Multi-Relational Database**: Relational SQL tables with SQLAlchemy for linking stocks, sectors, industries, and indexes, enabling complex and powerful queries.
- **Real-Time Data Retrieval**: Uses the `yfinance` and `yahooquery` libraries for accurate, up-to-date financial data.
- **Flexible Search Functionality**: Includes fuzzy search capabilities (with `fuzzywuzzy` and `Levenshtein`) to locate specific stocks, sectors, or indexes based on partial matches and approximate string matching.
- **Data Analysis Tools**: Pandas integration for financial data analysis, allowing users to conduct deeper insights into performance trends.
- **Cross-Origin Resource Sharing**: Configured with `flask-cors` to handle API requests from multiple origins.
- **Production-Ready**: Configured with `gunicorn` and `psycopg2` for PostgreSQL database management in a production environment.

## Tech Stack
- **Backend**: Flask (Python)
- **Database**: SQLAlchemy (PostgreSQL in production)
- **Data Retrieval APIs**: `yfinance`, `yahooquery`
- **Data Processing**: Pandas, Requests, BeautifulSoup
- **Production Setup**: Gunicorn, Flask-SQLAlchemy, Flask-CORS
- **String Matching**: FuzzyWuzzy, Levenshtein

## Usage

1. **Database Initialization**: Configure and initialize the relational database to store multi-level data on stocks, sectors, industries, and indexes.

2. **Data Retrieval and Population**: Populate the database using data fetched through `yfinance` and `yahooquery` libraries, with automatic updates on stock prices and other financial metrics.

3. **Search Stocks, Sectors, and Industries**: Use the built-in search functionality to locate specific stocks or sectors based on approximate matches, leveraging fuzzy matching for flexible queries.

4. **Data Analysis and Insights**: Utilize Pandas-based data processing capabilities to derive insights into stock trends, price movements, and market behavior.

### Example Queries
- **Fuzzy Search by Stock Name**: Search for stocks by approximate name matches.
- **Stock Performance Insights**: Retrieve historical and real-time stock metrics, visualized with data analysis tools.
- **Sector and Industry Aggregates**: View aggregate data metrics for entire sectors or industries.

## API Integration

FinDB uses multiple tools and APIs to retrieve, process, and display financial data.

- **Data Sources**:
  - `yfinance` and `yahooquery`: Real-time and historical data for stocks, indexes, and other financial instruments.
  - `requests` and `BeautifulSoup` (bs4): Web scraping capabilities to gather additional data (if needed).
  
- **Data Processing**:
  - **Pandas**: For in-depth analysis and transformation of stock data.
  - **String Matching**: Fuzzy search and approximate matching with `fuzzywuzzy` and `Levenshtein` for effective search functionality.
  
- **CORS Configuration**: Using `flask-cors` to manage cross-origin requests effectively, ensuring secure and smooth API calls.

## Contributing
We welcome contributions to FinDB! If you have ideas for new features, improvements, or bug fixes, please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch** (`git checkout -b feature/new-feature`)
3. **Commit Changes** (`git commit -m 'Add new feature'`)
4. **Push to Branch** (`git push origin feature/new-feature`)
5. **Create a Pull Request**

Please ensure all contributions adhere to the project’s coding standards and include relevant documentation.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
