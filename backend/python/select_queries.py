from db_connection import get_db_connection, close_db_connection
import pymysql.cursors # this is to fetch my data as a dictionary instead of a tuple 

def get_user(dbConnection=None, email=None, password=None):
    if dbConnection:
        try:
            # Use the connection directly to create a cursor
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                # Step 1: Check if the user exists by email first
                select_query = """
                SELECT * FROM user WHERE email = %s
                """
                cursor.execute(select_query, (email,))
                user = cursor.fetchone()

                if not user:
                    # User with the given email does not exist
                    return {"status": "error", "message": "User not found."}
                
                # Step 2: If a password is provided, check the password
                if password:
                    print (user) 
                    print (type(user))
                    if user['password_hash'] == password:
                        # Correct password
                        return {"status": "success", "user": user}
                    else:
                        # Incorrect password
                        return {"status": "error", "message": "Incorrect password."}
                
                # If no password is provided, just return the user information
                return {"status": "success", "user": user}

        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}





def get_appointments_by_user(user_id, user_role):
    if user_role == 2:
        query = """
        SELECT * FROM appointments WHERE patient_id_fk = %s
        """
    elif user_role == 1:
        query = """
        SELECT * FROM appointments WHERE doctor_id_fk = %s
        """
    else:
        raise ValueError("Invalid user type")
    
    connection, tunnel = get_db_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(query, (user_id))
            appointments = cursor.fetchall()
        return appointments
    finally:
        if connection:
            close_db_connection(connection, tunnel)

def get_billing_by_user(user_id):
    # select appointments
    # join appointments, patient and user table on user_id_fk
    return 0

def get_medication_by_user(user_id):
    # medication
    # join patient_medication, patient on user_id_fk
    return 0

def get_patients_by_doctor(doctor_id):
    # patient
    # join appointments, doctor and user on doctor_id
    return 0

def get_appointments_by_doctor(doctor_id):
    # appointments
    # join on patient on doctor_id_fk
    return 0