#create_db.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# needed for toDict() for jsonify
from sqlalchemy import inspect

app = Flask(__name__)
# enable CORS for connection to frontend
CORS(app)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:@localhost:5433/FinDB'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost:5432/postgres'

# cloud string pls do not delete!!!
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:db123@/postgres?host=/cloudsql/sacred-veld-427516-s5:us-central1:findb'
db = SQLAlchemy(app)

# HELPER : Association tables 

# Index
index_to_stock = db.Table('index_to_stock', # For full Stock List from Index (Only a few should be populated)
    db.Column('index_ticker', db.String(50), db.ForeignKey('index.ticker'), primary_key=True),
    db.Column('stock_ticker', db.String(50), db.ForeignKey('stock.ticker')),
    db.Column('percentage', db.Float)  # Weight
)
index_to_top_stocks = db.Table('index_to_top_stocks', # Top Stocks Scraped from Index Scraped (All Indexes Need this)
    db.Column('index_ticker', db.String(50), db.ForeignKey('index.ticker'), primary_key=True),
    db.Column('stock_ticker', db.String(50), db.ForeignKey('stock.ticker'), primary_key=True),
    db.Column('percentage', db.Float)  # Weight of the stock in the index
)
index_to_sector = db.Table('index_to_sector',
    db.Column('index_ticker', db.String(50), db.ForeignKey('index.ticker')),
    db.Column('sector_key', db.String(50), db.ForeignKey('sector.sector_key')),
    db.Column('percentage', db.Float)
)

# Stock
stock_to_top_index = db.Table('stock_to_top_index',
    db.Column('stock_ticker', db.String(50), db.ForeignKey('stock.ticker')),
    db.Column('index_ticker', db.String(50), db.ForeignKey('index.ticker'))
)

# Sector
sector_to_top_stocks = db.Table('sector_to_top_stocks', # Top Stocks Scraped from Index Scraped (All Indexes Need this)
    db.Column('sector_key', db.String(50), db.ForeignKey('sector.sector_key'), primary_key=True),
    db.Column('stock_ticker', db.String(50), db.ForeignKey('stock.ticker'), primary_key=True),
    db.Column('percentage', db.Float)  # Weight of the stock in the index
)
sector_to_top_index = db.Table('sector_to_top_index', # Top Stocks Scraped from Index Scraped (All Indexes Need this)
    db.Column('sector_key', db.String(50), db.ForeignKey('sector.sector_key'), primary_key=True),
    db.Column('index_ticker', db.String(50), db.ForeignKey('index.ticker'), primary_key=True),
    db.Column('percentage', db.Float)  # Weight of the index in the index
)

# Industry
industry_to_top_stocks = db.Table('industry_to_top_stocks', # Top Stocks Scraped from Index Scraped (All Indexes Need this)
    db.Column('industry_key', db.String(50), db.ForeignKey('industry.industry_key'), primary_key=True),
    db.Column('stock_ticker', db.String(50), db.ForeignKey('stock.ticker'), primary_key=True),
    db.Column('percentage', db.Float)  # Weight of the stock in the index
)

# Sector <--> Industry
correlation_sector_industry = db.Table('correlation_sector_industry', 
    db.Column('sector_key', db.String(50), db.ForeignKey('sector.sector_key'), primary_key=True),
    db.Column('industry', db.String(50), db.ForeignKey('industry.industry_key'), primary_key=True),
    db.Column('percentage', db.Float)  # Percentage of the stock in the index
)

# MODELS : 

class Index(db.Model):
    __tablename__ = 'index'
    ticker = db.Column(db.String(50), primary_key=True)  # PK
    name = db.Column(db.String(255), unique=True)  # Unique name

    # General Data
    nav = db.Column(db.Float)
    total_asset = db.Column(db.BigInteger)
    last_30_days_prices = db.Column(db.JSON)

    # Relationships
    sectors = db.relationship('Sector', secondary=index_to_sector, backref='indexes_from_sector')
    top_stocks = db.relationship('Stock', secondary=index_to_top_stocks, backref='top_indexes_from_stock')
    stocks = db.relationship('Stock', secondary=index_to_stock, backref='indexes')  # Can be NULL

    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }

class Stock(db.Model):
    __tablename__ = 'stock'
    ticker = db.Column(db.String(50), primary_key=True)

    # General Data
    name = db.Column(db.String(255))
    current_price = db.Column(db.Float)
    market_cap = db.Column(db.BigInteger)
    industry_key = db.Column(db.String(50), db.ForeignKey('industry.industry_key'))  # FK to Industry
    sector_key = db.Column(db.String(50), db.ForeignKey('sector.sector_key')) 
    last_30_days_prices = db.Column(db.JSON)

    # Relationships
    top_indexes = db.relationship('Index', secondary=stock_to_top_index, backref='stocks_top_indexes')
    industries = db.relationship('Industry', secondary=industry_to_top_stocks, back_populates='top_stocks')
    
    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }
class Sector(db.Model):
    __tablename__ = 'sector'
    sector_key = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    market_cap = db.Column(db.BigInteger)
    
    industries = db.relationship('Industry', secondary=correlation_sector_industry, back_populates='sectors')
    top_stocks = db.relationship('Stock', secondary=sector_to_top_stocks, backref='sectors_top_stocks')
    
    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }

class Industry(db.Model):
    __tablename__ = 'industry'
    industry_key = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(255))
    market_cap = db.Column(db.BigInteger)
    top_stocks = db.relationship('Stock', secondary=industry_to_top_stocks, back_populates='industries')
    sectors = db.relationship('Sector', secondary=correlation_sector_industry, back_populates='industries')

    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }

def drop_all_tables():
    db.drop_all()

def create_all_tables():
    db.create_all()



if __name__ == "__main__":
    with app.app_context():
        drop_all_tables()
        create_all_tables()
"""
    took outside of if statement so it runs when imported to app.py 
"""
def start_db():
    with app.app_context():
        drop_all_tables()
        create_all_tables()
