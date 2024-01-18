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



class Regulation(db.Model):
    __tablename__ = "Regulation"

    id = db.Column(db.Integer, primary_key=True)
    shortName = db.Column(db.Text(), nullable=False)
    fullTitle = db.Column(db.Text())
    country = db.Column(db.Text())
    regulator = db.Column(db.Text())
    link = db.Column(db.Text())
    hoverContent = db.Column(db.Text())
    jurisdiction = db.Column(db.Text())
    mandatory = db.Column(db.Boolean, nullable=False)
    enabled = db.Column(db.Boolean)

    def __init__(self, id, shortName, fullTitle, country, regulator, link, hoverContent, jurisdiction, mandatory, enabled):
        self.id = id
        self.shortName = shortName
        self.fullTitle = fullTitle
        self.country = country
        self.regulator = regulator
        self.link = link
        self.hoverContent = hoverContent
        self.jurisdiction = jurisdiction
        self.mandatory = mandatory
        self.enabled = enabled

    def map(self):
        return {
            'id': self.id, 
            'shortName': self.shortName, 
            'fullTitle': self.fullTitle, 
            'country': self.country, 
            'regulator': self.regulator,
            'link': self.link,
            'hoverContent': self.hoverContent,
            'jurisdiction': self.jurisdiction,
            'mandatory': self.mandatory,
            'enabled': self.enabled,
        }
