from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import true
from alembic.migration import MigrationContext
from alembic.operations import Operations
from sqlalchemy.sql.schema import Column
from server import db
import json
from sqlalchemy import Boolean, Column, Integer, Text, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID, ENUM, ARRAY
from sqlalchemy.engine import reflection
from sqlalchemy.exc import NoSuchTableError, DataError
import sys


class Entity(db.Model):
    __tablename__ = "Entity"

    id = db.Column(db.Integer, primary_key=True)
    entityCode = db.Column(db.Text())
    title = db.Column(db.Text(), nullable=False)
    country = db.Column(db.Integer, nullable=False)
    region = db.Column(db.Integer, nullable=False)
    owner = db.Column(db.Text())
    parent = db.Column(db.Integer)
    fiscal_year_end = db.Column(db.Date, nullable=False)
    included = db.Column(db.Boolean)
    other_name = db.Column(db.Text())
    active = db.Column(db.Boolean)
    notes = db.Column(db.Text())
    isRegistered = db.Column(db.Boolean)
    isParentCompany = db.Column(db.Boolean)
    isGlobalParent = db.Column(db.Boolean)
    hasBranches = db.Column(db.Boolean)
    isBranch = db.Column(db.Boolean)
    isPIE = db.Column(db.Boolean)
    debtOrEquityListedInEU = db.Column(db.Boolean)
    doesBusinessInCalifornia = db.Column(db.Boolean)
    secFilingStatus = db.Column(db.Text())
    year = db.Column(db.Integer)
    number_employees = db.Column(db.Integer)
    net_turnover = db.Column(db.Integer)
    balance_sheet = db.Column(db.Integer)
    prior_year = db.Column(db.Integer)
    number_employees_prior = db.Column(db.Integer)
    net_turnover_prior = db.Column(db.Integer)
    balance_sheet_prior = db.Column(db.Integer)
    currency = db.Column(db.Text())

    def __init__(self, id, entityCode, title, country, region, owner, parent, fiscal_year_end, included, other_name, active, notes, isRegistered, isParentCompany, isGlobalParent, hasBranches, isBranch, isPIE, debtOrEquityListedInEU, doesBusinessInCalifornia, secFilingStatus, year, number_employees, net_turnover, balance_sheet, prior_year, number_employees_prior, net_turnover_prior, balance_sheet_prior, currency):
        self.id = id
        self.entityCode = entityCode
        self.title = title
        self.country = country
        self.region = region
        self.owner = owner
        self.parent = parent
        self.fiscal_year_end = fiscal_year_end
        self.included = included
        self.other_name = other_name
        self.active = active
        self.notes = notes
        self.isRegistered = isRegistered
        self.isParentCompany = isParentCompany
        self.isGlobalParent = isGlobalParent
        self.hasBranches = hasBranches
        self.isBranch = isBranch
        self.isPIE = isPIE
        self.debtOrEquityListedInEU = debtOrEquityListedInEU
        self.doesBusinessInCalifornia = doesBusinessInCalifornia
        self.secFilingStatus = secFilingStatus
        self.year = year
        self.number_employees = number_employees
        self.net_turnover = net_turnover
        self.balance_sheet = balance_sheet
        self.prior_year = prior_year
        self.number_employees_prior = number_employees_prior
        self.net_turnover_prior = net_turnover_prior
        self.balance_sheet_prior = balance_sheet_prior
        self.currency = currency

    def map(self):
        return {
            'id': self.id,
            'entityCode': self.entityCode,
            'title': self.title,
            'country': self.country,
            'region': self.region,
            'owner': self.owner,
            'parent': self.parent,
            'fiscal_year_end': self.fiscal_year_end,
            'included': self.included,
            'other_name': self.other_name,
            'active': self.active,
            'notes': self.notes,
            'isRegistered': self.isRegistered,
            'isParentCompany': self.isParentCompany,
            'isGlobalParent': self.isGlobalParent,
            'hasBranches': self.hasBranches,
            'isBranch': self.isBranch,
            'isPIE': self.isPIE,
            'debtOrEquityListedInEU': self.debtOrEquityListedInEU,
            'doesBusinessInCalifornia': self.doesBusinessInCalifornia,
            'secFilingStatus': self.secFilingStatus,
            'year': self.year,
            'number_employees': self.number_employees,
            'net_turnover': self.net_turnover,
            'balance_sheet': self.balance_sheet,
            'prior_year': self.prior_year,
            'number_employees_prior': self.number_employees_prior,
            'net_turnover_prior': self.net_turnover_prior,
            'balance_sheet_prior': self.balance_sheet_prior,
            'currency': self.currency
        }
