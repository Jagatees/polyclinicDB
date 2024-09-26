from db_connection import get_db_connection, close_db_connection
from datetime import datetime
import random

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
- date YYYY-MM-DD
- time
- type
"""
def insert_appointment(dbConnection, appointment_info):
    connection = None
    if dbConnection:
        try:
            connection = dbConnection['connection']
            
            with connection.cursor() as cursor:
                
                available_doctors_query = """
                SELECT doctor_id FROM doctor WHERE doctor_id NOT IN (
                    SELECT doctor_id_fk 
                    FROM appointment 
                    WHERE date = %s AND time = %s
                )
                """
                cursor.execute(available_doctors_query, (appointment_info['date'], appointment_info['time']))
                available_doctors = cursor.fetchall()
                
                if not available_doctors:
                    # No doctors available at the selected time
                    return {"status": "error", "message": "No doctors are available at the selected date and time."}

                # randomise the doctor to be assigned
                assigned_doctor = random.choice(available_doctors)['doctor_id']

                
                insert_query = """
                INSERT INTO appointment (patient_id_fk, doctor_id_fk, date, time, status, type)
                VALUES (%s, %s, %s, %s, %s, %s)
                """
                
                cursor.execute(insert_query, (appointment_info['patient_id_fk'], assigned_doctor, appointment_info['date'], appointment_info['time'], 'pending', appointment_info['type']))

                connection.commit()

            return {"status": "success", "message": f"Appointment added successfully with doctor ID: {assigned_doctor}"}
    
        except Exception as e:
            if connection:
                connection.rollback()
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}


"""
diagnosis_info:
- patient_id_
- condition_id_
- doctor_id_fk
- severity

medication_info:
- patient_id
- medication_id
- doctor_id
- dosage
- frequency
- start_date YYYY-MM-DD
- end_date YYYY-MM-DD
"""
def insert_diagnosis(dbConnection, diagnosis_info, medication_info):
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

            insert_medication_query = """
            INSERT INTO patient_medication (patient_id_fk, medication_id_fk, doctor_id_fk, dosage, frequency, start_date, end_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """

            cursor.execute(insert_medication_query, (medication_info['patient_id_fk'], medication_info['medication_id_fk'], medication_info['doctor_id_fk'], medication_info['dosage'], medication_info['frequency'], medication_info['start_date'], medication_info['end_date']))
            connection.commit()
        
        return {"status": "success", "message": "Diagnosis added successfully."}

    except Exception as e:
        if connection:
            connection.rollback()
        #print(f"Status: error, Message: Error occurred: {str(e)}")
        return {"status": "error", "message": f"Error occurred: {str(e)}"}

"""
billing_info:
- appointment_id
- amount_due
- amount_paid
- billing_date
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

            cursor.execute(insert_query, (billing_info['appointment_id_fk'], billing_info['amount_due'], billing_info['amount_paid'], billing_info['billing_date'], 'pending', billing_info['payment_method']))

            connection.commit()

        return {"status": "success", "message": "Billing added successfully."}
    
    except Exception as e:
        if connection:
            connection.rollback()
        #print(f"Status: error, Message: Error occurred: {str(e)}")
        return {"status": "error", "message": f"Error occurred: {str(e)}"}