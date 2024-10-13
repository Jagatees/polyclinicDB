from db_connection import get_db_connection, close_db_connection
import pymysql.cursors # this is to fetch my data as a dictionary instead of a tuple 
from datetime import timedelta
import bcrypt

def verify_password(plain_password, hashed_password):
    # Function to verify if the provided password matches the hashed value
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_user(dbConnection=None, email=None, password=None):
    print ('in get_user')
    if dbConnection:
        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                select_query = """
                SELECT * FROM user WHERE email = %s
                """
                cursor.execute(select_query, (email,))
                user = cursor.fetchone()

                if not user:
                    return {"status": "error", "message": "User not found."}
                
                if password:
                    stored_hashed_password = user['password_hash'] 
                    if verify_password(password, stored_hashed_password):
                        
                        return {"status": "success", "user": user}
                    else:
                        return {"status": "error", "message": "Incorrect password."}
                
                return {"status": "success", "user": user}
            
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}


def get_appointments_by_user(dbConnection=None, user_id=None, user_role=None):
    #! the user_id in this case is a placeholder 
    #! its not the userid you are passing in but, if you are a doctor, it will be the doctor_id 
    #! if you are a patient, it will be the patient_id 

    if dbConnection:
        print (user_id)
        print (user_role)
        print (type(user_id))
        print (type(user_role))

        if user_role == 2:
            query = """
            SELECT * FROM appointment WHERE patient_id_fk = %s
            """
        elif user_role == 1:
            query = """
            SELECT * FROM appointment WHERE doctor_id_fk = %s
            """
        else:
            raise ValueError("Invalid user type")

        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(query, (user_id))
                appointments = cursor.fetchall()

            # Iterate over the results and convert `timedelta` to string
            for appointment in appointments:
                for key, value in appointment.items():
                    if isinstance(value, timedelta):
                        appointment[key] = str(value)  # Convert timedelta to string
            return appointments
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}


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
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}

def get_medications(dbConnection=None):
    if dbConnection:
        try:
            query = """
            SELECT * FROM medication
            """

            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(query)
                medications = cursor.fetchall()
            return medications
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}
    

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
                    JOIN patient p ON b.patient_id_fk = p.patient_id
                    WHERE p.patient_id = %s
                    ORDER BY billing_category;
                    """
                
                cursor.execute(query, (user_id,))
                billing_records = cursor.fetchall()

                current_billing = [record for record in billing_records if record['billing_category'] == 'current']
                history_billing = [record for record in billing_records if record['billing_category'] == 'history']
                
                return {"status": "success", "current": current_billing, "history": history_billing}
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}

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
                    pm.duration
                FROM patient_medication pm
                JOIN patient p ON pm.patient_id_fk = p.patient_id
                JOIN medication m ON pm.medication_id_fk = m.medication_id
                WHERE p.user_id_fk = %s;
                """
                cursor.execute(query, (user_id,))
                medications = cursor.fetchall()
                
                return {"status": "success", "medications": medications}
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}

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
                    u.first_name AS patient_first_name, 
                    u.last_name AS patient_last_name, 
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
                
                # Iterate over the results and convert `timedelta` to string
                for appointment in appointments:
                    for key, value in appointment.items():
                        if isinstance(value, timedelta):
                            appointment[key] = str(value)  # Convert timedelta to string
                return {"status": "success", "appointments": appointments}
            
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}


def get_id_by_user(dbConnection=None, user_id=None, role=None):
    if dbConnection:
        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:

                # Step 1: Determine the role
                if role is None:
                    # Fetch the user's role from the database
                    query = """
                    SELECT role FROM user WHERE user_id = %s
                    """
                    cursor.execute(query, (user_id,))
                    result = cursor.fetchone()
                    
                    if not result:
                        return {"status": "error", "message": "User not found"}
                    
                    role = result['role']
                else:
                    # Validate the provided role
                    if role not in [1, 2]:
                        return {"status": "error", "message": "Invalid role provided"}

                # Step 2: Fetch the ID based on the role
                if role == 1:
                    # Role 1: Fetch from doctor table
                    query = """
                    SELECT doctor_id FROM doctor WHERE user_id_fk = %s
                    """
                    cursor.execute(query, (user_id,))
                    doctor = cursor.fetchone()
                    
                    if doctor:
                        doctor_id = doctor['doctor_id']
                        return {"status": "success", "doctor_id": doctor_id}
                    else:
                        return {"status": "error", "message": "Doctor not found"}

                elif role == 2:
                    # Role 2: Fetch from patient table
                    query = """
                    SELECT patient_id FROM patient WHERE user_id_fk = %s
                    """
                    cursor.execute(query, (user_id,))
                    patient = cursor.fetchone()
                    
                    if patient:
                        patient_id = patient['patient_id']
                        return {"status": "success", "patient_id": patient_id}
                    else:
                        return {"status": "error", "message": "Patient not found"}
        
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"An error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}

def get_all_users_with_details(dbConnection=None):
    if dbConnection:
        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:

                # select from user table first
                query = """
                SELECT u.user_id, u.username, u.email, u.first_name, u.last_name, u.created_at, r.role_id
                FROM user u
                JOIN role r ON u.role_id_fk = r.role_id;
                """
                cursor.execute(query)
                users = cursor.fetchall()
                
                if not users:
                    return {"status": "error", "message": "No users found"}

                # using role id from user query
                all_users_details = []

                for user in users:
                    user_details = dict(user) 

                    role_id = user['role_id']

                    if role_id == 1:  # 1 id doctor role
                        doctor_query = """
                        SELECT d.phone_number, d.specialty
                        FROM doctor d
                        WHERE d.user_id_fk = %s;
                        """
                        cursor.execute(doctor_query, (user['user_id'],))
                        doctor_details = cursor.fetchone()
                        
                        if doctor_details:
                            user_details.update(doctor_details)

                            user_details.update({
                                'first_name': user['first_name'],
                                'last_name': user['last_name']
                            })
                        else:
                            user_details.update({"doctor_details": "Doctor details not found"})

                    elif role_id == 2:  # 2 is patient role
                        patient_query = """
                        SELECT p.age, p.gender, p.phone_number, p.address
                        FROM patient p
                        WHERE p.user_id_fk = %s;
                        """
                        cursor.execute(patient_query, (user['user_id'],))
                        patient_details = cursor.fetchone()
                        
                        if patient_details:
                            user_details.update(patient_details)

                            user_details.update({
                                'first_name': user['first_name'],
                                'last_name': user['last_name']
                            })
                        else:
                            user_details.update({"patient_details": "Patient details not found"})
                    
                    else:
                        user_details.update({"role": "Role not recognized"})

                    all_users_details.append(user_details)

                return {"status": "success", "users": all_users_details}
            
        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}
    
def get_user_profile(dbConnection, user_id):
    if dbConnection:
        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                user_query = """
                SELECT u.user_id, u.role_id_fk, u.username, u.email, u.first_name, u.last_name, u.created_at
                FROM user u
                WHERE u.user_id = %s
                """
                cursor.execute(user_query, (user_id,))
                user_info = cursor.fetchone()

                if not user_info:
                    return {"status": "error", "message": "User not found."}

                user_profile = {
                    "user_id": user_info['user_id'],
                    "username": user_info['username'],
                    "email": user_info['email'],
                    "first_name": user_info['first_name'],
                    "last_name": user_info['last_name'],
                    "created_at": user_info['created_at'],
                    "role": None
                }

                role_id = user_info['role_id_fk']

                if role_id == 1:  # doctor role
                    doctor_query = """
                    SELECT d.phone_number, d.specialty, d.license_number
                    FROM doctor d
                    WHERE d.user_id_fk = %s
                    """
                    cursor.execute(doctor_query, (user_id,))
                    doctor_info = cursor.fetchone()

                    if doctor_info:
                        user_profile["role"] = {
                            "role_name": "Doctor",
                            "phone_number": doctor_info['phone_number'],
                            "specialty": doctor_info['specialty'],
                            "license_number": doctor_info['license_number']
                        }

                elif role_id == 2:  # patient role
                    patient_query = """
                    SELECT p.age, p.gender, p.phone_number, p.address
                    FROM patient p
                    WHERE p.user_id_fk = %s
                    """
                    cursor.execute(patient_query, (user_id,))
                    patient_info = cursor.fetchone()

                    if patient_info:
                        user_profile["role"] = {
                            "role_name": "Patient",
                            "age": patient_info['age'],
                            "gender": patient_info['gender'],
                            "phone_number": patient_info['phone_number'],
                            "address": patient_info['address']
                        }

                return {"status": "success", "data": user_profile}

        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}
    

def get_patient_diagnoses_with_medications_by_appointment(dbConnection, patient_id, appointment_id):
    if dbConnection:
        try:
            with dbConnection.cursor(pymysql.cursors.DictCursor) as cursor:
                diagnosis_query = """
                SELECT diagnosis_id, diagnosis_description, doctor_id_fk, diagnosis_date, severity
                FROM diagnosis
                WHERE patient_id_fk = %s AND appointment_id_fk = %s
                """
                cursor.execute(diagnosis_query, (patient_id, appointment_id))
                diagnoses = cursor.fetchall()

                diagnosis_with_medications = []
                for diagnosis in diagnoses:
                    diagnosis_id = diagnosis['diagnosis_id']
                    
                    medication_query = """
                    SELECT pm.medication_id_fk, m.name, pm.dosage, pm.frequency, pm.duration
                    FROM patient_medication pm
                    JOIN medication m ON pm.medication_id_fk = m.medication_id
                    WHERE pm.diagnosis_id_fk = %s
                    """
                    cursor.execute(medication_query, (diagnosis_id,))
                    medications = cursor.fetchall()
                    
                    diagnosis_with_medications.append({
                        'diagnosis_id': diagnosis_id,
                        'diagnosis_description': diagnosis['diagnosis_description'],
                        'doctor_id': diagnosis['doctor_id_fk'],
                        'diagnosis_date': diagnosis['diagnosis_date'],
                        'severity': diagnosis['severity'],
                        'medications': medications
                    })

            return {"status": "success", "data": diagnosis_with_medications}

        # Error Handling
        except KeyError as e:
            return {"status": "error", "message": f"Missing key: {str(e)}"}
        except ValueError as e:
            return {"status": "error", "message": f"Invalid value: {str(e)}"}
        except Exception as e:
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    else:
        return {"status": "error", "message": "No database connection provided"}







