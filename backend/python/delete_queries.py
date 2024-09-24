from db_connection import get_db_connection, close_db_connection

def delete_user(user_id, role_id):
    connection = None
    try:
        connection, tunnel = get_db_connection()

        with connection.cursor() as cursor:
            if role_id == 1:  # doctor role
                delete_doc_query = """
                DELETE FROM doctor WHERE user_id_fk = %s
                """
                cursor.execute(delete_doc_query, (user_id,))

            elif role_id == 2:  # patient role
                delete_pat_query = """
                DELETE FROM patient WHERE user_id_fk = %s
                """
                cursor.execute(delete_pat_query, (user_id,))

            delete_user_query = """
            DELETE FROM user WHERE user_id = %s
            """
            cursor.execute(delete_user_query, (user_id,))

            connection.commit()

        return {"status": "success", "message": "User and related record deleted successfully."}

    except Exception as e:
        print(f"Status: error, Message: Error has occurred: {str(e)}")
        # return {"status": "error", "message": f"Error has occurred: {str(e)}"}

    finally:
        if connection:
            close_db_connection(connection, tunnel)
