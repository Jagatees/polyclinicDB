from db_connection import get_db_connection, close_db_connection
from datetime import datetime
import random
import select_queries

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
            connection = dbConnection

            with connection.cursor() as cursor:
                check_user_query = """
                SELECT user_id FROM user WHERE username = %s OR email = %s
                """
                cursor.execute(check_user_query, (user_info['username'], user_info['email']))
                existing_user = cursor.fetchone()
                
                if existing_user:
                    return {"status": "error", "message": "User already exists with this username or email."}

                insert_query = """
                INSERT INTO user (role_id_fk, username, password_hash, email, create_at)
                VALUES (%s, %s, %s, %s, %s)
                """

                current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                cursor.execute(insert_query, (user_info['role_id'], user_info['username'], user_info['password_hash'], user_info['email'], current_datetime))

                user_id = cursor.lastrowid
                print (user_id) 
                print (user_info['role_id']) 
                print ("inserted role , now inserting the patient table")


                if user_info['role_id'] == 1: # doctor role
                    doc_insert_query = """
                    INSERT INTO doctor (user_id_fk, first_name, last_name, phone_number)
                    VALUES (%s, %s, %s, %s)
                    """

                    cursor.execute(doc_insert_query, (user_id, role_info['first_name'], role_info['last_name'], role_info['phone_number']))

                elif user_info['role_id'] == 2: # patient role


                    print ("inserting patient table") 
                    print (role_info) 
                    pat_insert_query = """
                    INSERT INTO patient (user_id_fk, first_name, last_name, age, gender, phone_number, address)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """

                    cursor.execute(pat_insert_query, (user_id, role_info['first_name'], role_info['last_name'], role_info['age'], role_info['gender'], role_info['phone_number'], role_info['address']))

                connection.commit()
            
            return {"status": "success", "message": "User and related record inserted successfully."}
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            # rollback any changes made to database if any error occurs
            connection.rollback()
            #print(f"Status: error, Message: Error has occurred: {str(e)}")
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}

        # finally:
        #     if connection:
        #         close_db_connection(connection, tunnel)

"""
appointment_id, patient_id_fk (composite key)
appointment_info:
# - patient_id_fk //session
# - doctor_id_fk //you query

- user_id
- date YYYY-MM-DD
- time
- type
"""
def insert_appointment(dbConnection, appointment_info):
    print(appointment_info)
    if dbConnection:
        try:
            with dbConnection.cursor() as cursor:
                # get max appointment id of current patient
                get_max_appointment_id_query = """
                SELECT MAX(appointment_id) 
                FROM appointment 
                WHERE patient_id_fk = %s
                """
                cursor.execute(get_max_appointment_id_query, (appointment_info['patient_id'],))
                max_appointment_id = cursor.fetchone()[0]
                
                # if no appointment id exist for current patient id, reset to 0, else + 1 to max appointment id
                if max_appointment_id is None:
                    new_appointment_id = 0
                else:
                    new_appointment_id = max_appointment_id + 1

                # check for available doctors on the current date and time
                available_doctors_query = """
                SELECT d.doctor_id 
                FROM doctor d
                LEFT JOIN appointment a 
                ON d.doctor_id = a.doctor_id_fk AND a.date = %s AND a.time = %s
                WHERE a.doctor_id_fk IS NULL;
                """
                cursor.execute(available_doctors_query, (appointment_info['date'], appointment_info['time']))
                available_doctors = cursor.fetchall()
                
                # if there are no available doctors, send error
                if not available_doctors:
                    return {"status": "error", "message": "No doctors are available at the selected date and time."}
                
                # randomly assign the doctor
                assigned_doctor = random.choice(available_doctors)[0]

                insert_query = """
                INSERT INTO appointment (appointment_id, patient_id_fk, doctor_id_fk, date, time, status, type)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, (
                    new_appointment_id, 
                    appointment_info['patient_id'], 
                    assigned_doctor, 
                    appointment_info['date'], 
                    appointment_info['time'], 
                    'pending', 
                    appointment_info['type']
                ))

                dbConnection.commit()

            return {"status": "success", "message": f"Appointment added successfully with doctor ID: {assigned_doctor} for appointment ID: {new_appointment_id}"}
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            if dbConnection:
                dbConnection.rollback()
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
    if dbConnection:
        connection = dbConnection
        try:
            with connection.cursor() as cursor:
                insert_query = """
                INSERT INTO diagnosis (patient_id_fk, condition_id_fk, doctor_id_fk, diagnosis_date, severity)
                VALUES (%s, %s, %s, %s, %s)
                """

                current_date = datetime.now().strftime('%Y-%m-%d')
                cursor.execute(insert_query, (diagnosis_info['patient_id'], diagnosis_info['condition_id'], diagnosis_info['doctor_id'], current_date, diagnosis_info['severity']))

                insert_medication_query = """
                INSERT INTO patient_medication (patient_id_fk, medication_id_fk, doctor_id_fk, dosage, frequency, start_date, end_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """

                cursor.execute(insert_medication_query, (medication_info['patient_id'], medication_info['medication_id'], medication_info['doctor_id'], medication_info['dosage'], medication_info['frequency'], medication_info['start_date'], medication_info['end_date']))
                connection.commit()
            
            return {"status": "success", "message": "Diagnosis added successfully."}
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            if connection:
                connection.rollback()
            #print(f"Status: error, Message: Error occurred: {str(e)}")
            return {"status": "error", "message": f"Error occurred: {str(e)}"}

"""

billing_id, patient_id_fk, appointment_id_fk (composite key)
billing_info:
- patient_id 
- appointment_id
- amount_due
- amount_paid
- billing_date
- payment_method
"""
def insert_billing(dbConnection = None, billing_info = None):
    if dbConnection:
        try:
            with dbConnection.cursor() as cursor:
            
                insert_query = """
                INSERT INTO billing (patient_id_fk, appointment_id_fk, amount_due, amount_paid, billing_date, payment_status, payment_method)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """

                cursor.execute(insert_query, (billing_info['patient_id'], billing_info['appointment_id'], billing_info['amount_due'], billing_info['amount_paid'], billing_info['billing_date'], 'pending', billing_info['payment_method']))

                dbConnection.commit()

            return {"status": "success", "message": "Billing added successfully."}
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            if dbConnection:
                dbConnection.rollback()
            return {"status": "error", "message": f"Error occurred: {str(e)}"}
