from db_connection import get_db_connection, close_db_connection

def delete_user(dbConnection, user_id):
    if dbConnection: 
        try:
            connection = dbConnection

            with connection.cursor() as cursor:
                # Check if user exists
                check_user_query = """
                SELECT user_id, role_id_fk FROM user WHERE user_id = %s
                """
                cursor.execute(check_user_query, (user_id))
                existing_user = cursor.fetchone()

                if not existing_user:
                    return {"status": "error", "message": "User does not exist."}

                role_id = existing_user['role_id_fk']

                # Delete from role-specific table first
                if role_id == 1:  # doctor role
                    doc_delete_query = """
                    DELETE FROM doctor WHERE user_id_fk = %s
                    """
                    cursor.execute(doc_delete_query, (user_id))
                
                elif role_id == 2:  # patient role
                    pat_delete_query = """
                    DELETE FROM patient WHERE user_id_fk = %s
                    """
                    cursor.execute(pat_delete_query, (user_id))

                # Delete from user table
                user_delete_query = """
                DELETE FROM user WHERE user_id = %s
                """
                cursor.execute(user_delete_query, (user_id))

                # Commit the changes to the database
                connection.commit()

            return {"status": "success", "message": "User and related records deleted successfully."}
        
        except Exception as e:
            # Rollback any changes if an error occurs
            connection.rollback()
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}


