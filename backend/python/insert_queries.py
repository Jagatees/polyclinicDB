from db_connection import get_db_connection, close_db_connection
from datetime import datetime
"""
    user_info (dict)
        -role_id
        -username
        -password_hash
        -email
    
    role_info (dict)
        - doctor: {'first_name', 'last_name', 'phone_number'}
        - patient: {'first_name', 'last_name', 'age', 'gender', 'phone_number', 'address'}
"""
def insert_user(dbConnection, user_info, role_info):
    if dbConnection: 
        
        try:
            # connection, tunnel = get_db_connection()
            connection = dbConnection['connection'] 

            with connection.cursor() as cursor:
                insert_query = """
                INSERT INTO user (role_id_fk, username, password_hash, email, create_at)
                VALUES (%s, %s, %s, %s, %s)
                """

                current_date = datetime.now().strftime('%Y-%m-%d')
                cursor.execute(insert_query, (user_info['role_id'], user_info['username'], user_info['password_hash'], user_info['email'], current_date))

                user_id = cursor.lastrowid

                if user_info['role_id'] == 1: # doctor role
                    doc_insert_query = """
                    INSERT INTO doctor (user_id_fk, first_name, last_name, phone_number)
                    VALUES (%s, %s, %s, %s)
                    """

                    cursor.execute(doc_insert_query, (user_id, role_info['first_name'], role_info['last_name'], role_info['phone_number']))

                elif user_info['role_id'] == 2: # patient role
                    pat_insert_query = """
                    INSERT INTO patient (user_id_fk, first_name, last_name, age, gender, phone_number, address)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """

                    cursor.execute(pat_insert_query, (user_id, role_info['first_name'], role_info['last_name'],role_info['age'], role_info['gender'],  role_info['phone_number'], role_info['address']))

                connection.commit()
            
            return {"status": "success", "message": "User and related record inserted successfully."}
        
        except Exception as e:
            # rollback any changes made to database if any error occurs
            connection.rollback()
            #print(f"Status: error, Message: Error has occurred: {str(e)}")
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}

        # finally:
        #     if connection:
        #         close_db_connection(connection, tunnel)

"""
appointment_info:
- patient_id_fk
- doctor_id_fk
- date
- time
- type
"""

def insert_appointment(dbConnection, appointment_info):
    connection = None
    if dbConnection:
        try:
            connection = dbConnection['connection'] 

            with connection.cursor() as cursor:
                insert_query = """
                INSERT INTO appointment (patient_id_fk, doctor_id_fk, date, time, status, type)
                VALUES (%s, %s, %s, %s, %s, %s)
                """
            
                cursor.execute(insert_query, (appointment_info['patient_id_fk'], appointment_info['doctor_id_fk'], appointment_info['date'], appointment_info['time'], 'pending', appointment_info['type']))

                connection.commit()

            return {"status": "success", "message": "Appointment added successfully."}
    
        except Exception as e:
            if connection:
                connection.rollback()
            #print(f"Status: error, Message: Error occurred: {str(e)}")
            return {"status": "error", "message": f"Error occurred: {str(e)}"}

"""
diagnosis_info:
- patient_id_fk
- condition_id_fk
- doctor_id_fk
- severity
"""
def insert_diagnosis(dbConnection, diagnosis_info):
    connection = None
    try:
        connection = dbConnection['connection'] 

        with connection.cursor() as cursor:
            insert_query = """
            INSERT INTO diagnosis (patient_id_fk, condition_id_fk, doctor_id_fk, diagnosis_date, severity)
            VALUES (%s, %s, %s, %s, %s)
            """

            current_date = datetime.now().strftime('%Y-%m-%d')
            cursor.execute(insert_query, (diagnosis_info['patient_id_fk'], diagnosis_info['condition_id_fk'], diagnosis_info['doctor_id_fk'], current_date, diagnosis_info['severity']))

            connection.commit()
        
        return {"status": "success", "message": "Diagnosis added successfully."}

    except Exception as e:
        if connection:
            connection.rollback()
        #print(f"Status: error, Message: Error occurred: {str(e)}")
        return {"status": "error", "message": f"Error occurred: {str(e)}"}

"""
billing_info:
- appointment_id_fk
- amount_due
- amount_paid
- billing_date
- payment_status
- payment_method
"""
def insert_billing(dbConnection, billing_info):
    connection = None
    try:
        connection = dbConnection['connection']

        with connection.cursor() as cursor:
            insert_query = """
            INSERT INTO billing (appointment_id_fk, amount_due, amount_paid, billing_date, payment_status, payment_method)
            VALUES (%s, %s, %s, %s, %s, %s)
            """

            cursor.execute(insert_query, (billing_info['appointment_id_fk'], billing_info['amount_due'], billing_info['amount_paid'], billing_info['billing_date'], billing_info['payment_status'], billing_info['payment_method']))

            connection.commit()

        return {"status": "success", "message": "Billing added successfully."}
    
    except Exception as e:
        if connection:
            connection.rollback()
        #print(f"Status: error, Message: Error occurred: {str(e)}")
        return {"status": "error", "message": f"Error occurred: {str(e)}"}