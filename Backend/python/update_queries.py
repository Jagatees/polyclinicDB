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
                SET username = %s, email = %s, password = %s
                WHERE user_id = %s
                """
                cursor.execute(update_user_query, (user_info['username'], user_info['email'], user_info['password'], user_id))
                
                if role_id == 1:  # 1 is for doctor
                    update_doctor_query = """
                    UPDATE doctor
                    SET last_name = %s, phone_number = %s
                    WHERE user_id_fk = %s
                    """
                    cursor.execute(update_doctor_query, (user_info['last_name'], user_info['phone_number'], user_id))
                
                elif role_id == 2:  # 2 is for patient
                    update_patient_query = """
                    UPDATE patient
                    SET last_name = %s, phone_number = %s, address = %s
                    WHERE user_id_fk = %s
                    """
                    cursor.execute(update_patient_query, (user_info['last_name'], user_info['phone_number'], user_info['address'], user_id))
                
                connection.commit()

            return {"status": "success", "message": "User information updated successfully."}
        
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
                SET amount_paid = %s, status = %s, payment_method = %s, payment_date = %s
                WHERE billing_id = %s
                """
                
                current_date = datetime.now().strftime('%Y-%m-%d')
                cursor.execute(update_billing_query, (payment_info['amount_paid'], 'paid', payment_info['payment_method'], current_date, billing_id))

                connection.commit()
            
            return {"status": "success", "message": "Billing status updated successfully."}

        except Exception as e:
            connection.rollback()
            return {"status": "error", "message": f"Error occurred: {str(e)}"}


