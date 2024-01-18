from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import true
from alembic.migration import MigrationContext
from alembic.operations import Operations
from sqlalchemy.sql.schema import Column
from server import db
import json
from sqlalchemy import Boolean, Column, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, ENUM, ARRAY
from sqlalchemy.engine import reflection
from sqlalchemy.exc import NoSuchTableError, DataError
import sys


class ExchangeRate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference_date = db.Column(db.Date, nullable=False)
    rates = db.Column(db.JSONB, nullable=False)

    def __init__(self, id, reference_date, rates):
        self.id = id
        self.reference_date = reference_date
        self.rates = rates