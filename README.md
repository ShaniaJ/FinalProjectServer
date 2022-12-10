# Assignment 3 Server
This is the server project for assignment 3. 

## Requirements
You need a clean postgres database. Rename the .env.sample to .env and change the values to your database's 
connection info. Install requirements by running 
```bash
npm install
```

## Running
Start the server by running 
```bash
npm run start
```
The server will connect to the database, create the schema, and load test data  in an idempotent fashion. If you want 
to reset the data, drop all the tables in your database and restart.
