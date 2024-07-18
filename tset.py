import pandas as pd
table = pd.read_html('https://finance.yahoo.com/sectors/technology/')
print(table)