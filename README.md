# HackMIT React-Flask-Postgres Template
This is a basic template with React, Flask, and Postgres!

## Usage
Clone this repository to get started!

## Installations and Startup

### Client
To install client dependencies and start client, open up a new terminal and run
```bash
cd client
yarn install
yarn run dev
```
Your frontend should now be visible -- visiting the link provided by Vite in your terminal will show a simple Twitter mockup!

### Server
Create a PostgreSQL database called `tweeter` (see the Database section for more information). To configure the database connection, create a `.env` file in the `server` directory with the following content: 
```
SQLALCHEMY_DATABASE_URI = "postgresql://localhost/tweeter"
```

Now create a virtual environment, install dependencies, and start the server in a separate terminal window with 
```bash
cd server
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
flask run
```
Note that you may need to reinstall dependencies as new modules are added. 
Your backend should be set up now!

### Database
Begin by installing a PostgreSQL client such as pgAdmin (at https://www.pgadmin.org/download/) or Postgres.app (https://postgresapp.com/) if you have a Mac. Follow the instructions to install the application and create a server. Once you have created and started your server, you can run `psql` on your terminal and you should be connected to PostgreSQL!
At this stage, you can create a database by running `CREATE DATABASE "tweeter";` and your database will be created!

## Further info
There are plenty of resources online on how to use React, Flask, and PostgreSQL, but we recommend checking out the following official user guides below:  
https://react.dev/  
https://flask.palletsprojects.com/en/2.3.x/  
https://www.postgresql.org/docs/6.3/p02.htm  
Have fun hacking!
