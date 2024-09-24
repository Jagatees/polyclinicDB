from flask import Flask, jsonify, request, g
import select_queries
import insert_queries
import db_connection
import test

app = Flask(__name__)

@app.before_request
def get_db_connection():
    if 'dbConnection' not in g:
        dbConnection = {}
        connection, tunnel = db_connection.get_db_connection()  # Open new connection
        dbConnection['connection'] = connection
        dbConnection['tunnel'] = tunnel
        g.dbConnection = dbConnection  # Store the new connection in g
        print("New database connection and SSH tunnel established")

@app.teardown_appcontext
def reStartConnection(error): 
    # run after each request
    dbConnection = g.pop('dbConnection', None) # Get the connection from the app context 
    if dbConnection:
        db_connection.close_db_connection(dbConnection['connection'], dbConnection['tunnel'])
        print("Database connection and SSH tunnel closed")

    # reconnect to db 
    #get_db_connection() 


@app.route('/api/test')
def home():
    return jsonify({"message": "Hello, Flask!"})  # Return JSON instead of plain text

@app.route('/api/data', methods=['GET']) 
def getUserData():
    dbConnection = g.dbConnection 
    lol = select_queries.get_user_by_email(dbConnection,"emily.clark@example.com")
    print(lol)
    return jsonify({"message": "Hello, Flask!"})  # Return JSON instead of plain text



@app.route('/api/login', methods=['POST']) 
def login():
    dbConnection = g.dbConnection 
    if request.method == 'POST':
        data = request.get_json() 
        email = data['email']
        password = data['password']
        res = select_queries.get_user_by_email(dbConnection,email,password)
        print(res)
        return jsonify({"message": res})



@app.route('/api/register', methods=['POST','GET']) 
def register():
    dbConnection = g.dbConnection 
    if request.method == "POST": 
        data = request.get_json() 
        userInfo = data['userInfo'] 
        roleInfo = data['roleInfo']

        res = insert_queries.insert_user(dbConnection,userInfo,roleInfo) 
        print(res)
        return jsonify({"message": res})  # Return JSON instead of plain text
    
    #! testing purposes
    # userInfo = test.user_1_info
    # roleInfo = test.user_1_role


if __name__ == '__main__':
   
    app.run(debug=True)
