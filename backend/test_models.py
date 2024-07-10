from unittest import main, TestCase
# from flask_sqlalchemy import SQLAlchemy
from create_db import app, db, Index, Stock, Sector
from index_data import add_index_to_db, get_index_data
from stock_data import add_stock_to_db, stock_data_run
from sector_data import add_sector_to_db, scrape_sector_data


class TestModels(TestCase):
   data_dict = {}
   """
      STOCK MODEL 
   """
      #symbols = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'GOOG', 'BRK-B', 'LLY', 'JPM']

   def test_stock_1(self):
      # populate example DB
      symbols = ['NVDA']
      with app.app_context():
         db.create_all()
         for symbol in symbols:
            stock_data_run(symbol)
            stock_data = Stock.query.filter_by(ticker=symbol).first().toDict()
            print(stock_data)
            self.data_dict.update({symbol: stock_data})
         
         # Fetch NVDA
         stock_nvda = Stock.query.filter_by(ticker='NVDA').first()
         
         if stock_nvda:
            fetched_data = stock_nvda.toDict()
            print(fetched_data)
            self.assertDictEqual(self.data_dict['NVDA'], fetched_data)
         else:
            self.fail("NVDA not found in the database")

   # def test_stock_2(self):
   #    with app.app_context():
   #       print(self.data_dict.keys())
   #       query = Stock.query.get('META').toDict()
   #       self.maxDiff = 5000
   #       self.assertDictEqual(self.data_dict['META'], query)

   # def test_stock_3(self):
   #    with app.app_context():
   #       print(self.data_dict.keys())
   #       query = Stock.query.get('BRK-B').toDict()
   #       self.maxDiff = 5000
   #       self.assertDictEqual(self.data_dict['BRK-B'], query)

   """
      INDEX MODEL
   """
   def test_index_1(self):
      pass
   
   def test_index_2(self):
      pass
   
   def test_index_3(self):
      pass
      
   """
      SECTOR MODEL
   """
   def test_sector_1(self):
      pass
   
   def test_sector_2(self):
      pass

   def test_sector_3(self):
      pass


if __name__ == "__main__":
    main()
