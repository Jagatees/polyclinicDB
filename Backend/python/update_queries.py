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

