from collections import Counter
from werkzeug.exceptions import NotFound
from dateutil.parser import isoparse
from flask import jsonify, request, make_response, Response
from sqlalchemy import func

from server import db, app
from server.models import ExchangeRate
import io
import os
import csv
import json


@app.route('/add_exchange_rate', methods=['POST'])
def add_exchange_rate():
    data = request.json
    reference_date = data['reference_date']
    rates = data['rates']

    new_entry = ExchangeRate(reference_date=reference_date, rates=rates)
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({'message': 'Exchange rates added successfully'}), 201

@app.route('/get_exchange_rate', methods=['GET'])
def get_exchange_rate():
    exchange_rates = ExchangeRate.query.all()
    rates_data = [{
        'id': rate.id,
        'reference_date': rate.reference_date.isoformat(),
        'rates': rate.rates
    } for rate in exchange_rates]
    return jsonify(rates_data)
