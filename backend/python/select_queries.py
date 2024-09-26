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


def get_appointments_by_user(dbConnection=None, user_id=None, user_role=None):
    if dbConnection:
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

        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(query, (user_id))
                appointments = cursor.fetchall()
            return appointments
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}

def get_medical_conditions(dbConnection=None):
    if dbConnection:
        try:
            query = """
            SELECT * FROM medical_condition
            """

            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(query)
                medical_conditions = cursor.fetchall()
            return medical_conditions
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}


def get_billing_by_user(dbConnection=None, user_id=None):
    if dbConnection:
        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                query = """
                    SELECT 
                    b.billing_id, 
                    b.appointment_id_fk, 
                    b.amount_due, 
                    b.amount_paid, 
                    b.payment_status, 
                    b.payment_method, 
                        CASE 
                            WHEN b.payment_status = 'paid' THEN 'history'
                            WHEN b.payment_status = 'pending' THEN 'current'
                            ELSE 'unknown'
                        END AS billing_category
                    FROM billing b
                    JOIN appointment a ON b.appointment_id_fk = a.appointment_id
                    JOIN patient p ON a.patient_id_fk = p.patient_id
                    WHERE p.user_id_fk = %s
                    ORDER BY billing_category;
                    """
                
                cursor.execute(query, (user_id,))
                billing_records = cursor.fetchall()

                current_billing = [record for record in billing_records if record['billing_category'] == 'current']
                history_billing = [record for record in billing_records if record['billing_category'] == 'history']
                
                return {"status": "success", "current": current_billing, "history": history_billing}
            
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}

def get_medication_by_user(dbConnection=None, user_id=None):
    if dbConnection:
        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                query="""
                SELECT 
                    m.medication_id, 
                    m.name AS medication_name, 
                    m.description, 
                    m.price, 
                    pm.dosage, 
                    pm.frequency, 
                    pm.start_date, 
                    pm.end_date
                FROM patient_medication pm
                JOIN patient p ON pm.patient_id_fk = p.patient_id
                JOIN medication m ON pm.medication_id_fk = m.medication_id
                WHERE p.user_id_fk = %s;
                """
                cursor.execute(query, (user_id,))
                medications = cursor.fetchall()
                
                return {"status": "success", "medications": medications}
            
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}

def get_appointments_by_doctor(dbConnection=None, doctor_id=None):
    if dbConnection:
        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                query="""
                SELECT 
                    a.appointment_id, 
                    a.date, 
                    a.time, 
                    a.type, 
                    a.status, 
                    p.patient_id, 
                    p.first_name AS patient_first_name, 
                    p.last_name AS patient_last_name, 
                    p.age, 
                    p.gender, 
                    p.phone_number, 
                    u.email AS patient_email
                FROM appointment a
                JOIN patient p ON a.patient_id_fk = p.patient_id
                JOIN user u ON p.user_id_fk = u.user_id
                WHERE a.doctor_id_fk = %s;
                """
                cursor.execute(query, (doctor_id,))
                appointments = cursor.fetchall()

                return {"status": "success", "appointments": appointments}
            
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    return 0