from datetime import datetime

"""
user_info:
- username
- email
- password
- last_name
- phone_number
- address
"""
def update_user_info(dbConnection, user_id, user_info):
    if dbConnection:
        connection = dbConnection
        try:
            with connection.cursor() as cursor:
                role_query = """
                SELECT role_id FROM user WHERE user_id = %s
                """
                cursor.execute(role_query, (user_id,))
                role_id = cursor.fetchone()['role_id']
                
                # update user infos
                update_user_query = """
                UPDATE user
                SET username = %s, password_hash = %s,email = %s, first_name = %s, last_name = %s
                WHERE user_id = %s
                """
                cursor.execute(update_user_query, (user_info['username'], user_info['password_hash'], user_info['email'], user_info['first_name'],user_info['last_name'], user_id))
                
                if role_id == 1:  # 1 is for doctor
                    update_doctor_query = """
                    UPDATE doctor
                    SET  phone_number = %s, specialty = %s
                    WHERE user_id_fk = %s
                    """
                    cursor.execute(update_doctor_query, (user_info['phone_number'], user_info['specialty'], user_id))
                
                elif role_id == 2:  # 2 is for patient
                    update_patient_query = """
                    UPDATE patient
                    SET age = %s, phone_number = %s, address = %s, 
                    WHERE user_id_fk = %s
                    """
                    cursor.execute(update_patient_query, (user_info['age'], user_info['phone_number'], user_info['address'],  user_id))
                
                connection.commit()

            return {"status": "success", "message": "User information updated successfully."}
        
        except KeyError as ke:
            return {"status": "error", "message": f"Missing data in diagnosis_info: {str(ke)}"}

        except ValueError as ve:
            return {"status": "error", "message": f"Invalid data: {str(ve)}"}
        
        except Exception as e:
            if connection:
                connection.rollback()
            return {"status": "error", "message": f"Error occurred: {str(e)}"}

"""
appointment_info:
- date
- time
- type
"""
def update_appointment(dbConnection, patient_id, appointment_info):
    if dbConnection:
        connection = dbConnection
        try:
            with connection.cursor() as cursor:
                update_query = """
                UPDATE appointment
                SET date = %s, time = %s, type = %s
                WHERE patient_id_fk = %s
                """

                cursor.execute(update_query, (appointment_info['date'], appointment_info['time'], appointment_info['type'], patient_id))
                
                connection.commit()
            
            return {"status": "success", "message": "Appointment updated successfully."}

        except KeyError as ke:
            return {"status": "error", "message": f"Missing data in diagnosis_info: {str(ke)}"}

        except ValueError as ve:
            return {"status": "error", "message": f"Invalid data: {str(ve)}"}
        
        except Exception as e:
            if connection:
                connection.rollback()
            return {"status": "error", "message": f"Error occurred: {str(e)}"}


"""
assuming user pays full of the amount due

payment_info:
- amount_paid
- payment_method
"""
def update_billing_status(dbConnection, billing_id, payment_info):
    if dbConnection:
        try:
            connection = dbConnection['connection']

            with connection.cursor() as cursor:
                update_billing_query = """
                UPDATE billing
                SET amount_paid = %s, payment_date = %s, status = %s,  payment_method = %s, 
                WHERE billing_id = %s
                """
                
                current_date = datetime.now().strftime('%Y-%m-%d')
                cursor.execute(update_billing_query, (payment_info['amount_paid'],current_date, 'paid', payment_info['payment_method'], billing_id))

                connection.commit()
            
            return {"status": "success", "message": "Billing status updated successfully."}

        except KeyError as ke:
            return {"status": "error", "message": f"Missing data in diagnosis_info: {str(ke)}"}

        except ValueError as ve:
            return {"status": "error", "message": f"Invalid data: {str(ve)}"}
        
        except Exception as e:
            if connection:
                connection.rollback()
            return {"status": "error", "message": f"Error occurred: {str(e)}"}


"""
Update Diagnosis

diagnosis_info:
- condition_id_fk
- diagnosis_date
- severity
"""
def update_diagnosis(dbConnection, diagnosis_id, diagnosis_info):
    if dbConnection:
        try:
            connection = dbConnection['connection']

            with connection.cursor() as cursor:
                update_diagnosis_query = """
                UPDATE diagnosis
                SET condition_id_fk= %s, diagnosis_date = %s, severity = %s
                WHERE diagnosis_id = %s
                """

                current_date = datetime.now().strftime('%Y-%m-%d')
                cursor.execute(update_diagnosis_query, (diagnosis_info['condition_id_fk'], current_date, diagnosis_info['severity'], diagnosis_id))

                connection.commit()
            
            return {"status": "success", "message": "Diagnosis updated successfully."}

        except KeyError as ke:
            return {"status": "error", "message": f"Missing data in diagnosis_info: {str(ke)}"}

        except ValueError as ve:
            return {"status": "error", "message": f"Invalid data: {str(ve)}"}
        
        except Exception as e:
            if connection:
                connection.rollback()
            return {"status": "error", "message": f"Error occurred: {str(e)}"}

"""
Update Medication

medication_info:
- name
- description
- price
"""        
def update_medication(dbConnection, medication_id, medication_info):
    if dbConnection:
        try:
            connection = dbConnection

            with connection.cursor() as cursor:
                update_medication_query = """
                UPDATE medication
                SET name= %s, description = %s, price = %s
                WHERE medication_id = %s
                """

                cursor.execute(update_medication_query, (medication_info['name'],medication_info['description'], medication_info['price'], medication_id))

                connection.commit()
            
            return {"status": "success", "message": "Medication updated successfully."}

        except KeyError as ke:
            return {"status": "error", "message": f"Missing data in medication_info: {str(ke)}"}

        except ValueError as ve:
            return {"status": "error", "message": f"Invalid data: {str(ve)}"}
        
        except Exception as e:
            if connection:
                connection.rollback()
            return {"status": "error", "message": f"Error occurred: {str(e)}"}    

"""
Update Medical Condtion

medical_condition_info:
- name
- description
"""
def update_medical_condition(dbConnection, condition_id, condition_info):
    if dbConnection:
        try:
            connection = dbConnection

            with connection.cursor() as cursor:
                update_condition_query = """
                UPDATE medical_condition
                SET name= %s, description = %s
                WHERE condition_id = %s
                """

                cursor.execute(update_condition_query, (condition_info['name'],condition_info['description'], condition_id))

                connection.commit()
            
            return {"status": "success", "message": "Medical Condition updated successfully."}

        except KeyError as ke:
            return {"status": "error", "message": f"Missing data in condition_info: {str(ke)}"}

        except ValueError as ve:
            return {"status": "error", "message": f"Invalid data: {str(ve)}"}
        
        except Exception as e:
            if connection:
                connection.rollback()
            return {"status": "error", "message": f"Error occurred: {str(e)}"}  