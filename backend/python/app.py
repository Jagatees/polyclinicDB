from flask import Flask, jsonify, request, g
import select_queries
import insert_queries
import db_connection

app = Flask(__name__)

@app.before_request
def get_db_connection():
    if 'dbConnection' not in g:
        connection = db_connection.get_db_connection()  # Get connection from pool
        g.dbConnection = connection
        print("Database connection established")

@app.teardown_appcontext
def close_db_connection(error): 
    connection = g.pop('dbConnection', None)  # Get the connection from the app context 
    if connection:
        db_connection.close_db_connection(connection)
        print("Database connection returned to pool from flask")


#! Test Routes
#! ===========================================================================================
@app.route('/api/test')
def home():
    return jsonify({"message": "Hello, Flask!"})  # Return JSON instead of plain text

@app.route('/api/data', methods=['GET']) 
def getUserData():
    dbConnection = g.dbConnection 
    user_data = select_queries.get_user(dbConnection, "emily.clark@example.com")
    print(user_data)
    return jsonify({"message": user_data})

#! ===========================================================================================


#!=============================================================================
@app.route('/api/login', methods=['POST']) 
def login():
    dbConnection = g.dbConnection 
    if request.method == 'POST':
        data = request.get_json() 
        email = data['email']
        password = data['password']
        print (email, password)
        res = select_queries.get_user(dbConnection, email, password)
        print(res)
        return jsonify({"message": res})

@app.route('/api/register', methods=['POST', 'GET']) 
def register():
    dbConnection = g.dbConnection 
    if request.method == "POST": 
        data = request.get_json() 
        userInfo = data['userInfo'] 
        roleInfo = data['roleInfo']
        res = insert_queries.insert_user(dbConnection, userInfo, roleInfo) 
        print(res)
        return jsonify({"message": res})
#!===============================================================================

@app.route('/api/appointments', methods=['POST','GET'])
def getAppointment():
    dbConnection = g.dbConnection
    if request.method == 'GET':
        data = request.get_json()
        user_id = data['user_id']
        user_role = data['user_role']
        res = select_queries.get_appointments_by_user(dbConnection, user_id, user_role)
        print(res)
        return jsonify({"message": res})
    

    if request.method == 'POST':
        data = request.get_json()
        #appointment info should be a dictionary
        appointment_info = data['appointment_info'] 
        res = insert_queries.insert_appointment(dbConnection, appointment_info)
        print(res)
        return jsonify({"message": res})



if __name__ == '__main__':
    app.run(debug=True)
