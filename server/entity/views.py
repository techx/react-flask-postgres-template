from collections import Counter
from werkzeug.exceptions import NotFound
from dateutil.parser import isoparse
from flask import jsonify, request, make_response, Response, abort
from sqlalchemy import func

from server import db, app
from server.models import Entity
import io
import os
import csv
import json


@app.route('/add_entity', methods=['POST'])
def add_exchange_rate():
    data = request.json
    id = data['id']
    entityCode = data['entityCode']
    title = data['title']
    country = data['country']
    region = data['region']
    owner = data['owner']
    parent = data['parent']
    fiscal_year_end = data['fiscal_year_end']
    included = data['included']
    other_name = data['other_name']
    active = data['active']
    notes = data['notes']
    isRegistered = data['isRegistered']
    isParentCompany = data['isParentCompany']
    isGlobalParent = data['isGlobalParent']
    hasBranches = data['hasBranches']
    isBranch = data['isBranch']
    isPIE = data['isPIE']
    debtOrEquityListedInEU = data['debtOrEquityListedInEU']
    doesBusinessInCalifornia = data['doesBusinessInCalifornia']
    secFilingStatus = data['secFilingStatus']
    year = data['year']
    number_employees = data['number_employees']
    net_turnover = data['net_turnover']
    balance_sheet = data['balance_sheet']
    prior_year = data['prior_year']
    number_employees_prior = data['number_employees_prior']
    net_turnover_prior = data['net_turnover_prior']
    balance_sheet_prior = data['balance_sheet_prior']
    currency = data['currency']

    new_entry = Entity(
        id=id,
        entityCode=entityCode,
        title=title,
        country=country,
        region=region,
        owner=owner,
        parent=parent,
        fiscal_year_end=fiscal_year_end,
        included=included,
        other_name=other_name,
        active=active,
        notes=notes,
        isRegistered=isRegistered,
        isParentCompany=isParentCompany,
        isGlobalParent=isGlobalParent,
        hasBranches=hasBranches,
        isBranch=isBranch,
        isPIE=isPIE,
        debtOrEquityListedInEU=debtOrEquityListedInEU,
        doesBusinessInCalifornia=doesBusinessInCalifornia,
        secFilingStatus=secFilingStatus,
        year=year,
        number_employees=number_employees,
        net_turnover=net_turnover,
        balance_sheet=balance_sheet,
        prior_year=prior_year,
        number_employees_prior=number_employees_prior,
        net_turnover_prior=net_turnover_prior,
        balance_sheet_prior=balance_sheet_prior,
        currency=currency
    )

    db.session.add(new_entry)
    db.session.commit()

    return jsonify(new_entry.map()), 201

@app.route('/get_entities', methods=['GET'])
def get_entities():
    entities = Entity.query.all()
    res = []

    for entity in entities:
        res.append(entity.map())
    return jsonify(res), 200


@app.route('/get_entity/<id>', methods=['GET'])
def get_entity(id):
    entity = Entity.query.get(id)
    if entity is None:
        return "Entity does not exist", 401
    return jsonify(entity.map()), 200


@app.route('/delete_entity/<id>', methods=['GET'])
def delete_entity(id):
    entity = Entity.query.get(id)
    if entity is None:
        abort(404, description=f"Entity with ID {id} not found")
    
    db.session.delete(entity)
    db.session.commit()

    return jsonify(entity.map()), 200


@app.route('/edit_entity/<int:entity_id>', methods=['PUT'])
def edit_entity(entity_id):
    data = request.json
    entity = Entity.query.get(entity_id)

    if entity is None:
        return jsonify({'message': f'Entity with ID {entity_id} not found'}), 404

    # Update entity attributes
    entity.entityCode = data.get('entityCode', entity.entityCode)
    entity.title = data.get('title', entity.title)
    entity.country = data.get('country', entity.country)
    entity.region = data.get('region', entity.region)
    entity.owner = data.get('owner', entity.owner)
    entity.parent = data.get('parent', entity.parent)
    entity.fiscal_year_end = isoparse(data['fiscal_year_end']) if data.get('fiscal_year_end') else entity.fiscal_year_end
    entity.included = data.get('included', entity.included)
    entity.other_name = data.get('other_name', entity.other_name)
    entity.active = data.get('active', entity.active)
    entity.notes = data.get('notes', entity.notes)
    entity.isRegistered = data.get('isRegistered', entity.isRegistered)
    entity.isParentCompany = data.get('isParentCompany', entity.isParentCompany)
    entity.isGlobalParent = data.get('isGlobalParent', entity.isGlobalParent)
    entity.hasBranches = data.get('hasBranches', entity.hasBranches)
    entity.isBranch = data.get('isBranch', entity.isBranch)
    entity.isPIE = data.get('isPIE', entity.isPIE)
    entity.debtOrEquityListedInEU = data.get('debtOrEquityListedInEU', entity.debtOrEquityListedInEU)
    entity.doesBusinessInCalifornia = data.get('doesBusinessInCalifornia', entity.doesBusinessInCalifornia)
    entity.secFilingStatus = data.get('secFilingStatus', entity.secFilingStatus)
    entity.year = data.get('year', entity.year)
    entity.number_employees = data.get('number_employees', entity.number_employees)
    entity.net_turnover = data.get('net_turnover', entity.net_turnover)
    entity.balance_sheet = data.get('balance_sheet', entity.balance_sheet)
    entity.prior_year = data.get('prior_year', entity.prior_year)
    entity.number_employees_prior = data.get('number_employees_prior', entity.number_employees_prior)
    entity.net_turnover_prior = data.get('net_turnover_prior', entity.net_turnover_prior)
    entity.balance_sheet_prior = data.get('balance_sheet_prior', entity.balance_sheet_prior)
    entity.currency = data.get('currency', entity.currency)

    db.session.commit()

    return jsonify({'message': f'Entity with ID {entity_id} successfully updated'}), 200

