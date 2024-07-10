from unittest import main, TestCase
# from flask_sqlalchemy import SQLAlchemy
from create_db import app, db, Index, Stock, Sector
from index_data import add_index_to_db, index_data_run
from stock_data import add_stock_to_db, stock_data_run
from sector_data import add_sector_to_db, scrape_sector_data, sector_data_run


class TestModels(TestCase):
    data_dict = {}
    """
      STOCK MODEL 
    """
    # symbols = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'GOOG', 'BRK-B', 'LLY', 'JPM']

    def test_stock_1(self):
      # populate example DB
    #   symbols = ['NVDA']
      symbols = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'GOOG', 'BRK-B', 'LLY', 'JPM']

      with app.app_context():
         db.create_all()
         for symbol in symbols:
            stock_data_run(symbol)
            stock_data = Stock.query.filter_by(ticker=symbol).first().toDict()
            self.data_dict.update({symbol: stock_data})
         
         # Fetch NVDA
         index_w5000 = Stock.query.filter_by(ticker='NVDA').first()
         
         if index_w5000:
            fetched_data = index_w5000.toDict()
            self.assertDictEqual(self.data_dict['NVDA'], fetched_data)
         else:
            self.fail("NVDA not found in the database")

    def test_stock_2(self):
      with app.app_context():
         # Fetch NVDA
         stock_meta = Stock.query.filter_by(ticker='META').first()
         
         if stock_meta:
            fetched_data = stock_meta.toDict()
            self.assertDictEqual(self.data_dict['META'], fetched_data)
         else:
            self.fail("META not found in the database")

    def test_stock_3(self):
      with app.app_context():
         # Fetch NVDA
         stock_brk_b = Stock.query.filter_by(ticker='BRK-B').first()
         
         if stock_brk_b:
            fetched_data = stock_brk_b.toDict()
            self.assertDictEqual(self.data_dict['BRK-B'], fetched_data)
         else:
            self.fail("BRK-B not found in the database")

    """
      INDEX MODEL
   """
    def test_index_1(self):
        symbol = '^RUT'
        with app.app_context():
            index_data_run(symbol)
            index_data = Index.query.filter_by(ticker=symbol).first().toDict()
            print(index_data)
            self.data_dict.update({symbol: index_data})
            
            # Fetch NVDA
            index_w5000 = Index.query.filter_by(ticker='^RUT').first()
            
            if index_w5000:
                fetched_data = index_w5000.toDict()
                self.assertDictEqual(self.data_dict['^RUT'], fetched_data)
            else:
                self.fail("SPY not found in the database")


   
    def test_index_2(self):
      pass
   
    def test_index_3(self):
      pass
      
"""
      SECTOR MODEL
"""
#    def test_sector_1(self):
        
#         symbols=['technology']
#         with app.app_context():
#          db.create_all()
#          for symbol in symbols:
#             sector_data_run(symbol)
#             sector_data = Sector.query.filter_by(sector_key=symbol).first().toDict()
#             self.data_dict.update({symbol: sector_data})
         
#          # Fetch NVDA
#          index_w5000 = Sector.query.filter_by(sector_key='technology').first()
         
#          if index_w5000:
#             fetched_data = index_w5000.toDict()
#             self.assertDictEqual(self.data_dict['technology'], fetched_data)
#          else:
#             self.fail("technology not found in the database")
            
#    def test_sector_1(self):
#     pass
#    def test_sector_2(self):
#       pass

#    def test_sector_3(self):
#       pass


if __name__ == "__main__":
   main()
