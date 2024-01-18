from collections import Counter
from werkzeug.exceptions import NotFound
from dateutil.parser import isoparse
from flask import jsonify, request, make_response, Response, abort
from sqlalchemy import func

from server import db, app
from server.models import Regulation
import io
import os
import csv
import json


@app.route('/add_regulation', methods=['POST'])
def add_regulation():
    data = request.json
    id = data['id']
    shortName = data['shortName']
    fullTitle = data['fullTitle']
    country = data['country']
    regulator = data['regulator']
    link = data['link']
    hoverContent = data['hoverContent']
    jurisdiction = data['jurisdiction']
    mandatory = data['mandatory']
    enabled = data['enabled']

    new_entry = Regulation(
        id=id,
        shortName=shortName,
        fullTitle=fullTitle,
        country=country,
        regulator=regulator,
        link=link,
        hoverContent=hoverContent,
        jurisdiction=jurisdiction,
        mandatory=mandatory,
        enabled=enabled
    )
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({'message': 'Regulation added successfully'}), 201

@app.route('/get_regulations', methods=['GET'])
def get_regulations():
    regulations = Regulation.query.all()
    regulations_data = [{
        'id': regulation.id,
        'shortName': regulation.shortName,
        'fullTitle': regulation.fullTitle,
        'country': regulation.country,
        'regulator': regulation.regulator,
        'link': regulation.link,
        'hoverContent': regulation.hoverContent,
        'jurisdiction': regulation.jurisdiction,
        'mandatory': regulation.mandatory,
        'enabled': regulation.enabled
    } for regulation in regulations]
    return jsonify(regulations_data)

@app.route('/get_regulation/<id>', methods=['GET'])
def get_regulation(id):
    regulation = Regulation.query.get(id)
    if not regulation:
        return "Regulation does not exist", 401
    return jsonify(regulation), 200


@app.route('/remove/<id>', methods=['DELETE'])
def remove_regulation(id):
    regulation = Regulation.query.get(id)
    if regulation is None:
        abort(404, description=f"Regulation with ID {id} not found")

    db.session.delete(regulation)
    db.session.commit()

    return jsonify({'message': f'Regulation with ID {id} successfully deleted'}), 200

@app.route('/edit_regulation/<id>', methods=['PUT'])
def edit_regulation(id):
    data = request.json
    regulation = Regulation.query.get(id)

    if regulation is None:
        return jsonify({'message': f'Regulation with ID {id} not found'}), 404

    regulation.shortName = data.get('shortName', regulation.shortName)
    regulation.fullTitle = data.get('fullTitle', regulation.fullTitle)
    regulation.country = data.get('country', regulation.country)
    regulation.regulator = data.get('regulator', regulation.regulator)
    regulation.link = data.get('link', regulation.link)
    regulation.hoverContent = data.get('hoverContent', regulation.hoverContent)
    regulation.jurisdiction = data.get('jurisdiction', regulation.jurisdiction)
    regulation.mandatory = data.get('mandatory', regulation.mandatory)
    regulation.enabled = data.get('enabled', regulation.enabled)

    db.session.commit()

    return jsonify({'message': f'Regulation with ID {id} successfully updated'}), 200

