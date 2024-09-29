from db_connection import get_db_connection, close_db_connection
import pymysql.cursors 


def delete_user(dbConnection, user_id):
    if dbConnection: 
        try:
            connection = dbConnection

            # Use DictCursor to return rows as dictionaries
            with connection.cursor(pymysql.cursors.DictCursor) as cursor:
                # Check if user exists and retrieve role_id
                check_user_query = """
                SELECT user_id, role_id_fk FROM user WHERE user_id = %s
                """
                cursor.execute(check_user_query, (user_id,))
                existing_user = cursor.fetchone()

                if not existing_user:
                    return {"status": "error", "message": "User does not exist."}

                user_role_id = existing_user['role_id_fk']  # Access as dictionary

                # Delete from the appropriate role-specific table based on role_id
                if user_role_id == 1:  # doctor role
                    doc_delete_query = """
                    DELETE FROM doctor WHERE user_id_fk = %s
                    """
                    cursor.execute(doc_delete_query, (user_id,))
                
                elif user_role_id == 2:  # patient role
                    pat_delete_query = """
                    DELETE FROM patient WHERE user_id_fk = %s
                    """
                    cursor.execute(pat_delete_query, (user_id,))
                
                else:
                    return {"status": "error", "message": "Invalid role for this user."}

                # Finally, delete the user from the user table
                user_delete_query = """
                DELETE FROM user WHERE user_id = %s
                """
                cursor.execute(user_delete_query, (user_id,))

                # Commit the changes to the database
                connection.commit()

            return {"status": "success", "message": "User and related records deleted successfully."}
        
        
        except pymysql.err.IntegrityError as e:
            # Rollback any changes if an error occurs
            connection.rollback()
            return {"status": "error", "message": "User cannot be deleted due to existing dependencies."}
        
        except Exception as e:
            # Rollback any changes if an error occurs
            connection.rollback()
            return {"status": "error", "message": f"Error has occurred: {str(e)}"}


