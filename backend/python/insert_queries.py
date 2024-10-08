from db_connection import get_db_connection, close_db_connection
from datetime import datetime
import bcrypt
import random
import uuid


def generate_unique_uuid4(cursor):
    while True:
      
        new_uuid = str(uuid.uuid4())

        check_uuid_query = "SELECT license_number FROM doctor WHERE license_number = %s"
        cursor.execute(check_uuid_query, (new_uuid,))
        existing_uuid = cursor.fetchone()

        if not existing_uuid:
            return new_uuid
        
"""
    user_info (dict)
        - role_id
        - username
        - password_hash
        - email
        - first_name
        - last_name
    
    role_info (dict)
        - doctor: {'phone_number', 'speciality', 'license_number'}
        - patient: {'age', 'gender', 'phone_number', 'address'}
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
                
                # Hash the user's password using bcrypt
                hashed_password = bcrypt.hashpw(user_info['password_hash'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

                insert_query = """
                INSERT INTO user (role_id_fk, username, password_hash, email, first_name, last_name, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """

                current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                cursor.execute(insert_query, (user_info['role_id'], user_info['username'],hashed_password, user_info['email'], user_info['first_name'], user_info['last_name'],  current_datetime))

                user_id = cursor.lastrowid
                print (user_id) 
                print (user_info['role_id']) 
                print ("inserted role , now inserting the patient table")


                if user_info['role_id'] == 1: # doctor role

                    license_number = generate_unique_uuid4(cursor)

                    doc_insert_query = """
                    INSERT INTO doctor (user_id_fk, phone_number, specialty, license_number)
                    VALUES (%s, %s, %s, %s)
                    """

                    cursor.execute(doc_insert_query, (user_id, role_info['phone_number'], role_info['specialty'], license_number))

                elif user_info['role_id'] == 2: # patient role


                    print ("inserting patient table") 
                    print (role_info) 
                    pat_insert_query = """
                    INSERT INTO patient (user_id_fk, age, gender, phone_number, address)
                    VALUES (%s, %s, %s, %s, %s)
                    """

                    cursor.execute(pat_insert_query, (user_id, role_info['age'], role_info['gender'], role_info['phone_number'], role_info['address']))

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
def insert_billing(dbConnection=None, billing_info=None):
    if dbConnection:
        try:
            with dbConnection.cursor() as cursor:
                # Get max billing id for the current patient
                get_max_billing_id_query = """
                SELECT MAX(billing_id) 
                FROM billing 
                WHERE patient_id_fk = %s
                """
                cursor.execute(get_max_billing_id_query, (billing_info['patient_id'],))
                max_billing_id = cursor.fetchone()[0]
                
                # If no billing id exists for the current patient, reset to 0, else +1 to max billing id
                if max_billing_id is None:
                    new_billing_id = 0
                else:
                    new_billing_id = max_billing_id + 1

                # Insert the billing information with the new billing ID
                insert_query = """
                INSERT INTO billing (billing_id, patient_id_fk, appointment_id_fk, amount_due, amount_paid, billing_date, payment_status, payment_method)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, (new_billing_id, billing_info['patient_id'], billing_info['appointment_id'], billing_info['amount_due'], billing_info['amount_paid'], billing_info['billing_date'], 'pending', billing_info['payment_method']))

                dbConnection.commit()

            return {"status": "success", "message": f"Billing added successfully with billing ID: {new_billing_id}"}
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            if dbConnection:
                dbConnection.rollback()
            return {"status": "error", "message": f"Error occurred: {str(e)}"}



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
        
"""
On Assumption that it is a single insert
condition_info:
- name
- description

"""
def insert_medical_conditions(dbConnection=None, condition_info=None):
    if dbConnection:
        try:
            with dbConnection.cursor() as cursor:
                
                # checks for duplicate, if there is update it instead
                insert_query = """
                INSERT INTO medical_conditions (name, description)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE 
                name = VALUES(name), 
                description = VALUES(description);
                """
           
                cursor.executemany(insert_query, (condition_info['name'], condition_info['description']))

                dbConnection.commit()  

            return {"status": "success", "message": "Medical conditions added/updated successfully."}

        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            if dbConnection:
                dbConnection.rollback()  
            return {"status": "error", "message": f"Error occurred: {str(e)}"}
        

"""
On Assumption that it is a single insert
medication_info:
- name
- description
- price

"""
def insert_medication(dbConnection=None, medication_info=None):
    if dbConnection:
        try:
            with dbConnection.cursor() as cursor:
                
                # checks for duplicate, if there is update it instead
                insert_query = """
                INSERT INTO medication (name, description, price)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                name = VALUES(name), 
                description = VALUES(description),
                price = VALUES(price);
                """
           
                cursor.executemany(insert_query, (medication_info['name'], medication_info['description']. medication_info['price']))

                dbConnection.commit()  

            return {"status": "success", "message": "Medication added/updated successfully."}

        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            if dbConnection:
                dbConnection.rollback()  
            return {"status": "error", "message": f"Error occurred: {str(e)}"}

        


