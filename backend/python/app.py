from flask import Flask, jsonify, request, g
import select_queries
import insert_queries
import db_connection
import delete_queries

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
@app.route('/test')
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
#* =============================================================================
"""
{
"email":"baba@gmail.com",
"password":"123"
}

"""
@app.route('/login', methods=['POST']) 
def login():
    dbConnection = g.dbConnection 
    if request.method == 'POST':
        data = request.get_json() 
        email = data['email']
        password = data['password']
        print (email, password)
        res = select_queries.get_user(dbConnection, email, password)
        print(res)

        if res['status'] == 'success':
            user_id = res['user']['user_id'] 
            user_role = res['user']['role_id_fk'] 
            if user_role == 1: 
                role = 'doctor'
            elif user_role == 2:
                role = 'patient'
            else:
                role = 'admin'
            #get the id by user unless the user is an admin 
            if role != 'admin':
                roleRES = select_queries.get_id_by_user(dbConnection, user_id, user_role)

                res['user'][f'{role}_id'] = roleRES[f"{role}_id"] 

        return jsonify({"message": res})
    
'''
{
  "user_info" : {
    "role_id": 2,
    "username": "johndoe",
    "password_hash": "123",
    "email": "baba@gmail.com",
    "first_name": "John",
    "last_name": "Doe"
  }
    ,
	"role_info" : {
      "age": 23,
      "gender": "m",
      "phone_number": "89482392",
      "address": "123, Ang Mo Kio, Lagos"
    }
}
if doctor, 
{
  "user_info" : {
    "role_id": 1,
    "username": "BOBON",
    "password_hash": "12345",
    "email": "mama123@gmail.com",
    "first_name": "Bobon",
    "last_name": "Dobo"
  }
    ,
	"role_info" : {
      "phone_number": "89482312",
      "specialty": "Woman"
    }
}
'''

@app.route('/register', methods=['POST', 'GET']) 
def register():
    dbConnection = g.dbConnection 
    if request.method == "POST": 
        data = request.get_json() 
        userInfo = data['user_info'] 
        roleInfo = data['role_info']
        res = insert_queries.insert_user(dbConnection, userInfo, roleInfo) 
        print(res)
        return jsonify({"message": res})
    

'''
{
  "user_id": 3,
  }
'''

@app.route('/delete_user', methods=['POST']) 
def deleteUser():
    dbConnection = g.dbConnection 
    if request.method == "POST": 
        data = request.get_json() 
        user_id = data['user_id'] 
        res = delete_queries.delete_user(dbConnection, user_id) 
        return jsonify({"message": res}) 

#!===============================================================================
'''
POST appointment 
{
  "appointment_info": {
    "date": "2024-09-28",
    "time": "06:10:05",
    "type": "Medical Consultation",
    "user_id": 74,
    "patient_id": 1
  }
}
'''
@app.route('/appointments', methods=['POST','GET'])
def getAppointment():
    dbConnection = g.dbConnection

    if request.method == 'POST':
        data = request.get_json()
        #appointment info should be a dictionary
        appointment_info = data['appointment_info'] 
        res = insert_queries.insert_appointment(dbConnection, appointment_info)
        print(res)
        return jsonify({"message": res})

@app.route('/appointments/<user_id>/<role_id>', methods=['GET'])
def getAppointments(user_id,role_id):
    dbConnection = g.dbConnection
    if request.method == 'GET':
        user_id = int(user_id)
        role_id = int(role_id)

        res = select_queries.get_appointments_by_user(dbConnection, user_id, role_id)
        print(res)
        return jsonify({"message": res})



@app.route('/appointments/<doctor_id>/', methods=['GET'])
def getAppointmentsbyDoctor(doctor_id):
    dbConnection = g.dbConnection
    if request.method == 'GET':
        doctor_id = int(doctor_id)
        res = select_queries.get_appointments_by_doctor(dbConnection, doctor_id)
        print(res)
        return jsonify({"message": res})
#!===============================================================================
'''
POST diagnosis 
{
    "diagnosis_info": {
                    "patient_id": 1,
                    "condition_id": 1,
                    "doctor_id": 1,
                    "severity": "moderate"}, 
    "medication_info": {
                    "patient_id": 1,
                    "medication_id": 1,
                    "doctor_id": 1,
                    "dosage": 1,
                    "frequency": 1,
                    "start_date": "2021-01-01",
                    "end_date": "2021-02-01"

    }, 
    "role": 1}
'''
# GET all diagnoses for a user
#Post a diagnosis for a user
@app.route('/diagnosis', methods=['POST'])
def Diagnosis():
    dbConnection = g.dbConnection
    
    if request.method == 'POST':
        data = request.get_json()
        #diagnosis info should be a dictionary
        diagnosis_info = data['diagnosis_info'] 
        medication_info = data['medication_info'] 
        role = data['role']

        # run the function if role is doctor 
        if role == 1: 
            res = insert_queries.insert_diagnosis(dbConnection, diagnosis_info, medication_info)
            print(res)
        else:
            res = {"status": "error", "message": "Only doctors can add a diagnosis."}
        return jsonify({"message": res})


@app.route('/medication', methods=['GET'])
def getMedications():
    dbConnection = g.dbConnection
    if request.method == 'GET':
        res = select_queries.get_medications(dbConnection)
        print(res)
        return jsonify({"message": res})

@app.route('/medication/<user_id>', methods=['GET'])
def getMedicationByUser(user_id):
    dbConnection = g.dbConnection
    if request.method == 'GET':
        # Assuming `get_medication_by_user` takes a db connection and user_id
        res = select_queries.get_medication_by_user(dbConnection, user_id)
        print(res)
        return jsonify({"message": res})
    
    
#! function not implemented  ?
@app.route('/diagnosis/<user_id>', methods=['GET'])
def getDiagnosis(user_id):
    dbConnection = g.dbConnection
    if request.method == 'GET':
        # Assuming `get_diagnosis_by_user` takes a db connection and user_id
        res = select_queries.get_diagnosis_by_user(dbConnection, user_id)
        print(res)
        return jsonify({"message": res})
    
#!===============================================================================
'''
POST BILLING 
{
    "billing_info": {
                    "appointment_id": 1,
                    "amount_due": 1,
                    "amount_paid": 10,
                    "billing_date": "2023-01-01",
                    "payment_method":"cash"}
}
'''
@app.route('/billing', methods=['POST'])
def billing():
    dbConnection = g.dbConnection
    
    if request.method == 'POST':
        data = request.get_json()
        billing_info = data['billing_info'] 
        res = insert_queries.insert_billing(dbConnection, billing_info)
        print(res)
        return jsonify({"message": res})


@app.route('/billing/<user_id>', methods=['GET'])
def getBilling(user_id):
    dbConnection = g.dbConnection
    if request.method == 'GET':
        # Assuming `get_billing_by_user` takes a db connection and user_id
        res = select_queries.get_billing_by_user(dbConnection, user_id)
        print(res)
        return jsonify({"message": res})

#!=============================================================================== 
# get all users 
@app.route('/users/<role_id>', methods=['GET'])
def getUsers(role_id):
    dbConnection = g.dbConnection
    if request.method == 'GET':
        role_id = int(role_id) 
        if role_id == 3: 
            res = select_queries.get_all_users_with_details(dbConnection)
            print(res)
            return jsonify({"message": res})
        else:
            res = {"status": "error", "message": "Only admin can view all users."}
            return jsonify({"message": res})
        
#!===============================================================================


#!===============================================================================
if __name__ == '__main__':
    with app.app_context():
        get_db_connection()
    app.run(debug=True)
