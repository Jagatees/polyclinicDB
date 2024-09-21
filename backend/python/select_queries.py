from db_connection import get_db_connection, close_db_connection

def get_user_by_email(email):
    connection = None
    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            select_query = """
            SELECT * FROM user WHERE email = %s
            """

            cursor.execute(select_query, (email))
            
            # fetch single result (assumption of unique email)
            user = cursor.fetchone()

            if user:
                return {"status": "success", "user": user}
            else:
                return {"status": "error", "message": "User not found."}
            
    except Exception as e:
        return {"status": "error", "message": f"Error has occurred: {str(e)}"}
    finally:
        if connection:
            close_db_connection(connection)