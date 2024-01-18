# from models import Result
import os
import psycopg2
from flask import Flask, jsonify, render_template, request
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import HTTPException
import hashlib
import traceback
from sqlalchemy.orm import relationship
from flask_migrate import Migrate

from dotenv import load_dotenv
load_dotenv()
DB_URL = os.environ.get('SQLALCHEMY_DATABASE_URI')
print(DB_URL)


CONFIG_FILE = "./config.py"
# Initialize app and set up database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
db = SQLAlchemy(app)
migrate = Migrate(app, db)

        
@app.route('/')
def hello():
    return 'hello world'



@app.cli.command('resetdb')
def resetdb_command():
    """Destroys and creates the database + tables."""

    from sqlalchemy_utils import database_exists, create_database, drop_database
    if database_exists(DB_URL):
        print('Deleting database.')
        drop_database(DB_URL)
    if not database_exists(DB_URL):
        print('Creating database.')
        create_database(DB_URL)

    print('Creating tables.')
    db.create_all()
    print('Shiny!')


def setup_default_routes():
    """
    Set up default routes for app
    """

    @app.errorhandler(404)
    def default(error):
        # returns build React frontend
        return render_template("index.html"), 200

    @app.errorhandler(Exception)
    def handle_exception(e):
        error_trace = traceback.format_exc()
        app.logger.error(error_trace)

        if isinstance(e, HTTPException):
            return e

        error_number = (
            int(hashlib.sha256((error_trace).encode(
                "utf-8")).hexdigest(), 16) % 10**6
        )
        return f"Encountered server error {error_number} :(", 500


with app.app_context():
    import server.models

    db.create_all()
    db.session.commit()
    setup_default_routes()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
