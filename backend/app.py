from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy, pagination
from create_db import app, db, Stock, Index, Sector, index_to_sector, start_db
from sector_data import sector_data_run
from index_data import start_index
from stock_data import stock_data_run, populate_stock_data
from create_db import app, db, Stock, Index, Sector, index_to_sector, index_to_top_stocks, stock_to_top_index, correlation_sector_industry
from sqlalchemy import asc, desc, or_
import os

# start_db()
# sector_data_run()
# start_index()
# populate_stock_data()
error_msg = "ERROR: specify the model in the endpoint. eg /api/model"
print("STARTING")


@app.route('/dbtest')
def test_db():
    # Stock()

    return {"message": "test"}, 200


@app.route("/")
@app.route("/index.html")
@app.route("/index.html#")
def index():
    # return render_template('index.html')
    return "<p>Use /api/<model> and specify a model to access endpoints!</p>"

@app.route('/api/treemap_data', methods=['GET'])
def get_treemap_data():
    # Query the database to get sector and industry data
    sectors = Sector.query.all()
    sector_data = []
    for sector in sectors:
        sector_dict = sector.toDict()
        sector_dict['industries'] = []
        industries = db.session.query(correlation_sector_industry).filter_by(sector_key=sector.sector_key).all()
        for industry in industries:
            sector_dict['industries'].append({
                'industry': industry.industry,
                'percentage': industry.percentage
            })
        sector_data.append(sector_dict)

    return jsonify(sector_data)


@app.route("/api/search")
def search_all_models():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    sort_by = request.args.get('sort_by', default=None, type=str)
    sort_order = request.args.get('sort_order', default=None, type=str)
    q = request.args.get('q', default=None, type=str)
    q_in = request.args.get('q_in', default=None, type=str)
    models = {
        Sector: "sector",
        Index: "index",
        Stock: "stock",
    }

    search_cols = {
        'sector': [
            'sector.name',
            'sector.sector_key'
        ],
        'index': [
            'index.name',
            'index.ticker'
        ],
        'stock': [
            'stock.name',
            'stock.ticker',
            'stock.industry_key',
            'stock.sector_key'
        ],
    }
    response_dict = {}
    meta_dict = {}
    sectors = Sector.query
    indexes = Index.query
    stocks = Stock.query
    final_cond = []
    res = {"results": [], "total": 0}
    if q:
        # search all
        conds = []
        for table in models.keys():
            print(f"******TABLE: {table}******")
            query = table.query
            for col in table.__table__.columns:
                if str(col) not in search_cols[models[table]]:
                    continue
                else:
                    conds.append(col.ilike(f"%{q}%"))
            final_cond = or_(*conds)
            # filter by category ***********do we need?
            # if q_in:
            #     final_condition = and_(
            #         final_condition,
            #         func.array_to_string(table.categories, " ").ilike(f"%{category}%"),
            #     )

            query = table.query.filter(final_cond)
            print(f"******TABLE: {query.__table__}******")

            # sectors = Sector.query.filter(final_cond).paginate(
            #     page=page, per_page=per_page)
            # indexes = Index.query.filter(final_cond).paginate(
            #     page=page, per_page=per_page)
            # stocks = Stock.query.filter(final_cond).paginate(
            #     page=page, per_page=per_page)
            records = [row.toDict() for row in query]
            for i in range(len(records)):
                records[i]["model"] = models[table]
            res["results"] += records
            res["total"] += len(records)

            # response = []
            # for i in query:
            #     i = i.toDict()
            #     if i['last_30_days_prices']:
            #         del i['last_30_days_prices']
            #     response.append(i)
            # response_dict[models[table]] = response
            # meta_dict[models[table]] = {'pages': query.pages,
            #                             'total_instances': query.total}
            # response = []
            # for i in indexes:
            #     response.append(i.toDict())
            # response_dict['indexes'] = response
            # meta_dict['indexes'] = {'pages': indexes.pages,
            #                         'total_instances': indexes.total}
            # response = []
            # for i in stocks:
            #     response.append(i.toDict())
            # response_dict['stocks'] = response
            # meta_dict['stocks'] = {'pages': stocks.pages,
            #                        'total_instances': stocks.total}

    def paginate(arr, page_size):
        try:
            page_size = int(page_size)
        except:
            page_size = 20
        res = []
        index = -1
        cnt = page_size
        for k in arr:
            if cnt == page_size:
                res.append([])
                cnt = 0
                index += 1
            res[index].append(k)
            cnt += 1
        return res
    res['results'] = paginate(res['results'], per_page)
    return jsonify(res)
    # return jsonify({'data': response_dict, 'meta': meta_dict})

    '''
        SECTORS
    '''


@app.get("/api/sector/")
def get_sectors():
    page = request.args.get('page', type=int, default=1)
    per_page = request.args.get('per_page', default=10, type=int)
    sort_by = request.args.get('sort_by', default=None, type=str)
    sort_order = request.args.get('sort_order', default=None, type=str)
    q = request.args.get('q', default=None, type=str)
    q_in = request.args.get('q_in', default=None, type=str)
    search_cols = [
        'sector.name',
        'sector.sector_key'
    ]

    sectors = Sector.query
    final_cond = []
    if q:
        # search all
        conds = []
        for col in Sector.__table__.columns:
            if str(col) not in search_cols:
                continue
            else:
                conds.append(col.ilike(f"%{q}%"))
        final_cond = or_(*conds)

    if q and q_in:
        """
        Search specific attr, sort
        """
        if sort_by:
            if sort_order == 'asc' or not sort_order:
                sectors = Sector.query.filter(
                    getattr(Sector, q_in).ilike(f"%{q}%")).order_by(asc(getattr(Sector, sort_by))).paginate(
                    page=page, per_page=per_page)
            else:
                sectors = Sector.query.filter(
                    getattr(Sector, q_in).ilike(f"%{q}%")).order_by(desc(getattr(Sector, sort_by))).paginate(
                    page=page, per_page=per_page)
        else:
            sectors = Sector.query.filter(
                getattr(Sector, q_in).ilike(f"%{q}%")).paginate(
                    page=page, per_page=per_page)
    elif q:
        """
        Search all str attrs, sort
        """
        if sort_by:
            if sort_order == 'asc' or not sort_order:
                sectors = Sector.query.filter(final_cond).order_by(asc(getattr(Sector, sort_by))).paginate(
                    page=page, per_page=per_page)
            else:
                sectors = Sector.query.filter(final_cond).order_by(desc(getattr(Sector, sort_by))).paginate(
                    page=page, per_page=per_page)
        else:
            sectors = Sector.query.filter(final_cond).paginate(
                page=page, per_page=per_page)
    else:
        """
        Don't search just sort
        """
        if sort_by:
            if sort_order == 'asc' or not sort_order:
                sectors = Sector.query.order_by(asc(getattr(Sector, sort_by))).paginate(
                    page=page, per_page=per_page)
            else:
                sectors = Sector.query.order_by(desc(getattr(Sector, sort_by))).paginate(
                    page=page, per_page=per_page)
        else:
            sectors = Sector.query.paginate(
                page=page, per_page=per_page)
    response = []
    for sector in sectors.items:
        sector_dict = sector.toDict()

        # Fetch top stock for this sector
        top_stock = Stock.query.filter_by(sector_key=sector.sector_key) \
            .order_by(desc(Stock.market_cap)) \
            .first()
        if top_stock:
            sector_dict['top_stock'] = top_stock.toDict()['ticker']

        # Fetch top index associated with this sector
        top_index = Index.query.join(index_to_sector, Index.ticker == index_to_sector.c.index_ticker) \
            .filter(index_to_sector.c.sector_key == sector.sector_key) \
            .order_by(desc(index_to_sector.c.percentage)) \
            .first()
        if top_index:
            sector_dict['top_index'] = top_index.toDict()['ticker']

        # Top industry
        sector_dict['top_industry'] = sector.highest_industry
        sector_dict['top_industry_percentage'] = sector.highest_industry_percentage
        
        response.append(sector_dict)
    meta = {
        'pages': sectors.pages,
        'total_instances': sectors.total
    }
    return jsonify({'data': response, 'meta': meta}), 200



@app.get("/api/sector/<id>")
def get_sector(id):
    sector = Sector.query.get(id)
    if sector:
        """

        I copied and pasted the top stock, top index, and market cap ratio code from the above if statement so
        that the table and instance displayed the same information. Top 10 stocks/indexes formatting is not readable.

        """

        sector_dict = sector.toDict()
        # Fetch top stock for this sector
        # top_stock = Stock.query.filter_by(sector_key=sector.sector_key)\
        #                         .order_by(desc(Stock.market_cap))\
        #                         .first()
        # if top_stock:
        #     sector_dict['top_stock'] = top_stock.toDict()['ticker']

        # Fetch top index associated with this sector
        # top_index = Index.query.join(index_to_sector, Index.ticker == index_to_sector.c.index_ticker)\
        #     .filter(index_to_sector.c.sector_key == sector.sector_key)\
        #     .order_by(desc(index_to_sector.c.percentage))\
        #     .first()
        # if top_index:
        #     sector_dict['top_index'] = top_index.toDict()['ticker']

        # Top 10 stocks in market sector dominance
        top_10_stocks = Stock.query.filter_by(sector_key=sector.sector_key)\
            .order_by(desc(Stock.market_cap))\
            .limit(10)
        combined_market_cap = sum(
            stock.market_cap for stock in top_10_stocks)

        # Retrieve the total market cap of the entire sector
        total_market_cap = sector.market_cap

        # Calculate the ratio of combined market cap of the top 10 stocks to the total market cap of the sector
        if total_market_cap > 0:
            market_cap_ratio = combined_market_cap / total_market_cap
        else:
            market_cap_ratio = 0  # Handling division by zero if there's no market cap data available

        sector_dict['market_cap_ratio'] = market_cap_ratio

        # Fetch top stocks in this sector sorted by market cap
        sector_dict = sector.toDict()

        top_stocks = Stock.query.filter_by(sector_key=sector.sector_key)\
            .order_by(desc(Stock.market_cap))\
            .limit(10).all()
        sector_dict['top_stocks'] = [stock.toDict()['ticker']
                                     for stock in top_stocks]
        # Join Index with index_to_sector and order by percentage
        top_indexes = Index.query.join(index_to_sector, Index.ticker == index_to_sector.c.index_ticker)\
            .filter(index_to_sector.c.sector_key.like(sector.sector_key))\
            .order_by(desc(index_to_sector.c.percentage))\
            .limit(10).all()
        sector_dict['top_indexes'] = [index.toDict()['ticker']
                                      for index in top_indexes]

        return jsonify(sector_dict), 200
    else:
        return jsonify({"message": "Sector not found"}), 404


'''
INDEXES
'''


@app.get("/api/index/")
def get_indexes():
    page = request.args.get('page', type=int, default=1)
    per_page = request.args.get('per_page', default=10, type=int)
    sort_by = request.args.get('sort_by', default=None, type=str)
    sort_order = request.args.get('sort_order', default=None, type=str)
    q = request.args.get('q', default=None, type=str)
    q_in = request.args.get('q_in', default=None, type=str)
    search_cols = [
        'index.name',
        'index.ticker'
    ]

    indexes = Index.query
    final_cond = []
    if q:
        # search all
        conds = []
        for col in Index.__table__.columns:
            if str(col) not in search_cols:
                continue
            else:
                conds.append(col.ilike(f"%{q}%"))
        final_cond = or_(*conds)
    if q and q_in:
        """
        Search specific attr, sort
        """
        if sort_by:
            if sort_order == 'asc' or not sort_order:
                indexes = Index.query.filter(
                    getattr(Index, q_in).ilike(f"%{q}%")).order_by(asc(getattr(Index, sort_by))).paginate(
                    page=page, per_page=per_page)
            else:
                indexes = Index.query.filter(
                    getattr(Index, q_in).ilike(f"%{q}%")).order_by(desc(getattr(Index, sort_by))).paginate(
                    page=page, per_page=per_page)
        else:
            indexes = Index.query.filter(
                getattr(Index, q_in).ilike(f"%{q}%")).paginate(
                page=page, per_page=per_page)
    elif q:
        if sort_by:
            if sort_order == 'asc' or not sort_order:
                indexes = Index.query.filter(final_cond).order_by(asc(getattr(Index, sort_by))).paginate(
                    page=page, per_page=per_page)
            else:
                indexes = Index.query.filter(final_cond).order_by(desc(getattr(Index, sort_by))).paginate(
                    page=page, per_page=per_page)
        else:
            indexes = Index.query.filter(final_cond).paginate(
                page=page, per_page=per_page)
    else:
        if sort_by:
            if sort_order == 'asc' or not sort_order:
                indexes = Index.query.order_by(asc(getattr(Index, sort_by))).paginate(
                    page=page, per_page=per_page)
            else:
                indexes = Index.query.order_by(desc(getattr(Index, sort_by))).paginate(
                    page=page, per_page=per_page)
        else:
            indexes = Index.query.paginate(
                page=page, per_page=per_page)
    response = []
    for index in indexes:
        r = index.toDict()
        del r['last_30_days_prices']
        # *** WE NEED ONE MORE ATTRIBUTE FOR INDEX MODEL PAGE! ***
        response.append(r)
    # pagination = Pagination(page=page, total=len(response), record_name='response')
    meta = {
        'pages': indexes.pages,
        'total_instances': indexes.total
    }
    return jsonify({'data': response, 'meta': meta}), 200


@ app.get("/api/index/<id>")
def get_index(id):
    # Query the index_to_sector table to get associated sectors for the given index id
    index = Index.query.get(id)
    if index:
        index_dict = index.toDict()
        # del index_dict['last_30_days_prices']  # Remove unwanted field

        # Fetch sectors associated with the index
        sector_data = db.session.query(
            index_to_sector).filter_by(index_ticker=id).all()
        sectors = []
        top_sector = None
        max_percentage = 0
        for data in sector_data:
            sectors.append(data.sector_key)
            if data.percentage > max_percentage:
                max_percentage = data.percentage
                top_sector = data.sector_key

        # Add sectors to the response
        index_dict['sectors'] = sectors

        if top_sector:
            index_dict['top_sector'] = top_sector
            index_dict['top_sector_percentage'] = max_percentage

        # Fetch top stocks associated with the index
        top_stocks_data = db.session.query(
            index_to_top_stocks).filter_by(index_ticker=id).all()
        top_stocks = []

        # ADDED CODE TO FIND THE TOP STOCK
        # top_stock = None
        # max_percentage = 0

        for data in top_stocks_data:

            # stock_dict = {
            #    'stock_ticker': data.stock_ticker,
            #    'percentage': data.percentage
            # }
            top_stocks.append(data.stock_ticker)

            # if data.percentage > max_percentage:
            #    max_percentage = data.percentage
            #    top_stock = stock_dict

        # Add top stocks to the response
        index_dict['top_stocks'] = top_stocks
        # index_dict['top_stock'] = top_stock['stock_ticker']
        # index_dict['top_stock_percentage'] = top_stock['percentage']

        return jsonify(index_dict), 200
    else:
        return jsonify({"message": "Index not found"}), 404


'''
STOCKS
'''


@ app.get("/api/stock/")
def get_stocks():
    # *** WE NEED TO ADD A CONNECTION FROM STOCK TO INDEX ***
    page = request.args.get('page', type=int, default=1)
    per_page = request.args.get('per_page', default=10, type=int)
    sort_by = request.args.get('sort_by', default=None, type=str)
    sort_order = request.args.get('sort_order', default=None, type=str)
    q = request.args.get('q', default=None, type=str)
    q_in = request.args.get('q_in', default=None, type=str)
    search_cols = [
        'stock.name',
        'stock.ticker',
        'stock.industry_key',
        'stock.sector_key'
    ]
    stocks = Stock.query
    final_cond = []
    if q:
        # search all
        conds = []
        for col in Stock.__table__.columns:
            if str(col) not in search_cols:
                continue
            else:
                conds.append(col.ilike(f"%{q}%"))
        final_cond = or_(*conds)
    if q and q_in:
        """
        Search specific attr, sort
        """
        if sort_by:
            if sort_order == 'asc' or not sort_order:
                stocks = Stock.query.filter(
                    getattr(Stock, q_in).ilike(f"%{q}%")).order_by(asc(getattr(Stock, sort_by))).paginate(
                    page=page, per_page=per_page)
            else:
                stocks = Stock.query.filter(
                    getattr(Stock, q_in).ilike(f"%{q}%")).order_by(desc(getattr(Stock, sort_by))).paginate(
                    page=page, per_page=per_page)
        else:
            stocks = Stock.query.filter(
                getattr(Stock, q_in).ilike(f"%{q}%")).paginate(
                page=page, per_page=per_page)
    elif q:

        if sort_by:
            if sort_order == 'asc' or not sort_order:
                stocks = Stock.query.filter(final_cond).order_by(asc(getattr(Stock, sort_by))).paginate(
                    page=page, per_page=per_page)
            else:
                stocks = Stock.query.filter(final_cond).order_by(desc(getattr(Stock, sort_by))).paginate(
                    page=page, per_page=per_page)
        else:
            stocks = Stock.query.filter(final_cond).paginate(
                page=page, per_page=per_page)
    else:
        if sort_by:
            if sort_order == 'asc' or not sort_order:
                stocks = Stock.query.order_by(asc(getattr(Stock, sort_by))).paginate(
                    page=page, per_page=per_page)
            else:
                stocks = Stock.query.order_by(desc(getattr(Stock, sort_by))).paginate(
                    page=page, per_page=per_page)
        else:
            stocks = Stock.query.paginate(
                page=page, per_page=per_page)

    response = []
    for stock in stocks:
        r = stock.toDict()
        del r['last_30_days_prices']
        response.append(r)

    meta = {
        'pages': stocks.pages,
        'total_instances': stocks.total
    }
    return jsonify({'data': response, 'meta': meta}), 200


@app.get("/api/stock/<id>")
def get_stock(id):
    stock = Stock.query.get(id)
    if stock:
        r = stock.toDict()
        r['last_30_days_prices']

        top_indexes = db.session.query(
            stock_to_top_index).filter_by(stock_ticker=id).all()
        top_indexes = [data.index_ticker for data in top_indexes]
        r['top_indexes'] = top_indexes

        return jsonify(r), 200
    else:
        return jsonify({"message": "Stock not found"}), 404


# POST
'''
'''


@app.post("/api/<name>/")
def post_resource(name):
    form = request.form.to_dict()
    if name == "sector":
        new_sector = Sector(
            key=form['key'],
            name=form['name'],
            market_cap=form['market_cap'],
            largest_companies=form['largest_companies'],
            industries=form['industries'],
            etf_opportunities=form['etf_opportunies'],
        )
        db.session.add(new_sector)
        db.session.commit()
        response = Sector.query.get(form['key'])
        return jsonify(response.toDict()), 200
    elif name == "index":
        new_index = Index(
            ticker=form['ticker'],
            full_name=form['full_name'],
            current_price=form['current_price'],
            total_assets=form['total_assets'],
            last_30_days_prices=form['last_30_days_prices'],
        )
        db.session.add(new_index)
        db.session.commit()
        response = Index.query.get(form['ticker'])
        return jsonify(response.toDict()), 200
    elif name == "stock":
        new_stock = Stock(
            ticker=form['ticker'],
            full_name=form['full_name'],
            current_price=form['current_price'],
            market_cap=form['market_cap'],
            industry=form['industry'],
            sector_key=form['sector_key'],
            top_10_indexes=form['top_10_indexes'],
            last_30_days_prices=form['last_30_days_prices'],
        )
        db.session.add(new_stock)
        db.session.commit()
        response = Stock.query.get(form['ticker'])
        return jsonify(response.toDict()), 200
    else:
        return jsonify({"message": error_msg}), 400

# PUT



@app.put("/api/<name>/<id>")
def put_resource(name, id):
    if id is None:
        return jsonify({'message': "ERROR: Please specify an identifier!"}), 400
    form = request.form.to_dict()
    if name == "sector":
        up_sector = Sector.query.get(id)
        # update with new JSON
        up_sector.key = form['key'],
        up_sector.name = form['name'],
        up_sector.market_cap = form['market_cap'],
        up_sector.largest_companies = form['largest_companies'],
        up_sector.industries = form['industries'],
        up_sector.etf_opportunities = form['etf_opportunies']
        db.session.commit()
        response = Sector.query.get(id)
        return jsonify(response.toDict()), 200
    elif name == "index":
        up_index = Index.query.get(id)
        # update with new JSON
        up_index.ticker = form['ticker'],
        up_index.full_name = form['full_name'],
        up_index.current_price = form['current_price'],
        up_index.total_assets = form['total_assets'],
        up_index.last_30_days_prices = form['last_30_days_prices']
        db.session.commit()
        response = Index.query.get(id)
        return jsonify(response.toDict()), 200
    elif name == "stock":
        up_stock = Stock.query.get(id)
        # update with new JSON
        up_stock.ticker = form['ticker'],
        up_stock.full_name = form['full_name'],
        up_stock.current_price = form['current_price'],
        up_stock.market_cap = form['market_cap'],
        up_stock.industry = form['industry'],
        up_stock.sector_key = form['sector_key'],
        up_stock.top_10_indexes = form['top_10_indexes'],
        up_stock.last_30_days_prices = form['last_30_days_prices']
        db.session.commit()
        response = Stock.query.get(id)
        return jsonify(response.toDict()), 200
    else:
        return jsonify({'message': error_msg}), 400


# DELETE
@app.delete("/api/<name>/<id>")
def delete_resource(name, id):
    if id is None:
        return jsonify({'message': "ERROR: Please specify an identifier!"}), 400
    if name == "sector":
        Sector.query.filter_by(key=id).delete()
        db.session.commit()
        return jsonify({"message": f"Sector {id} deleted."}), 200
    elif name == "index":
        Index.query.filter_by(ticker=id).delete()
        db.session.commit()
        return jsonify({"message": f"Index {id} deleted."}), 200

    elif name == "stock":
        Stock.query.filter_by(ticker=id).delete()
        db.session.commit()
        return jsonify({"message": f"Stock {id} deleted."}), 200
    else:
        return jsonify({'message': error_msg}), 400


# host='0.0.0.0' to make the server publicly available.
if __name__ == "__main__":
    start_db()
    print("DB RESET COMPLETE")
    sector_data_run()
    print("SECTOR COMPLETE")
    start_index()
    print("INDEX COMPLETE")
    populate_stock_data()
    print("ALL MODELS COMPLETE ||| RUNNING SERVER")

    app.run(debug=True, use_reloader=False, host='0.0.0.0')
