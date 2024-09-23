from db_connection import get_db_connection, close_db_connection

def get_user_by_email(email):
    connection = None
    try:
        connection, tunnel = get_db_connection()

        with connection.cursor() as cursor:
            select_query = """
            SELECT * FROM user WHERE email = %s
            """

            cursor.execute(select_query, (email))
            
            # fetch single result (assumption of unique email)
            user = cursor.fetchone()

            if user:
                print({"status": "success", "user": user})
                #return {"status": "success", "user": user}
            else:
                print({"status": "error", "message": "User not found."})
                #return {"status": "error", "message": "User not found."}
            
    except Exception as e:
        print(f"Status: error, Message: Error has occurred: {str(e)}")
        #return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    finally:
        if connection:
            close_db_connection(connection, tunnel)

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