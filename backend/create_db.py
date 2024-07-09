from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Joshd123@localhost:5432/findb'
db = SQLAlchemy(app)

# Association tables for many-to-many relationships
etf_stock_association = db.Table('etf_stock_association',
   db.Column('etf_ticker', db.String(50), db.ForeignKey('etf.ticker')),
   db.Column('stock_ticker', db.String(50), db.ForeignKey('stock.ticker'))
)
etf_sector_association = db.Table('etf_sector_association',
   db.Column('etf_ticker', db.String(50), db.ForeignKey('etf.ticker')),
   db.Column('sector_key', db.String(50), db.ForeignKey('sector.key'))
)



class Stock(db.Model):
   __tablename__ = 'stock'
   ticker = db.Column(db.String(50), nullable=False, unique=True, primary_key=True)
   full_name = db.Column(db.String(50))
   current_price = db.Column(db.Float)
   market_cap = db.Column(db.String(50))
   industry = db.Column(db.String(50))
   sector_key = db.Column(db.String(50), db.ForeignKey('sector.key'))
   top_10_indexes = db.Column(db.JSON)
   last_30_days_prices = db.Column(db.JSON)

   # Relationships
   sector = db.relationship('Sector', back_populates='stocks')
   etfs = db.relationship('ETF', secondary=etf_stock_association, back_populates='top_ten_holdings')

   def toDict(self):
      return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }
"""
   "key": ""
   "name": ""
   "market_cap":  ""
   "largest_companies": ""
   "industries": ""
   "etf_opportunities": ""
"""
class Sector(db.Model):
   __tablename__ = 'sector'
   key = db.Column(db.String(50), nullable=False, unique=True, primary_key=True)
   name = db.Column(db.String(50), nullable=False)
   market_cap = db.Column(db.String(50))
   largest_companies = db.Column(db.JSON)
   industries = db.Column(db.JSON)
   etf_opportunities = db.Column(db.JSON)

   # Relationships
   stocks = db.relationship('Stock', back_populates='sector')
   etfs = db.relationship('ETF', secondary=etf_sector_association, back_populates='top_sectors')

   def toDict(self):
      return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }

"""
   'ticker': ""
   'full_name': ""
   'current_price': ""
   'total_assets': ""
   'last_30_days_prices': ""
"""
class ETF(db.Model):
   __tablename__ = 'etf'
   
   ticker = db.Column(db.String(50), primary_key=True)
   full_name = db.Column(db.String(50))
   current_price = db.Column(db.Float)
   total_assets = db.Column(db.String(50))
   last_30_days_prices = db.Column(db.JSON)

   # Relationships
   top_ten_holdings = db.relationship('Stock', secondary=etf_stock_association, back_populates='etfs')
   top_sectors = db.relationship('Sector', secondary=etf_sector_association, back_populates='etfs')

   def toDict(self):
      return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }
with app.app_context():
    db.create_all()