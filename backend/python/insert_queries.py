from db_connection import get_db_connection, close_db_connection

"""
    user_info (dict)
        -role_id
        -username
        -password_hash
        -email
        -created_at
    
    role_info (dict)
        - doctor: {'first_name', 'last_name', 'phone_number'}
        - patient: {'first_name', 'last_name', 'age', 'gender', 'phone_number', 'address'}
"""
def insert_user(user_info, role_info):
    connection = None
    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            insert_query = """
            INSERT INTO user (role_id_fk, username, password_hash, email)
            VALUES (%s, %s, %s, %s)
            """

            cursor.execute(insert_query, (user_info['role_id'], user_info['username'], user_info['password_hash'], user_info['email']))

            user_id = cursor.lastrowid

            if user_info['role_id'] == 1: # doctor role
                doc_insert_query = """
                INSERT INTO doctor (user_id_fk, first_name, last_name, phone_number)
                VALUES (%s, %s, %s, %s)
                """

                cursor.execute(doc_insert_query, (user_id, role_info['first_name'], role_info['last_name'], role_info['phone_number']))

            elif user_info['role_id'] == 2: # patient role
                pat_insert_query = """
                INSERT INTO patient (user_id_fk, first_name, last_name, age, gender, phone_number, address)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """

                cursor.execute(pat_insert_query, (user_id, role_info['first_name'], role_info['last_name'],role_info['age'], role_info['gender'],  role_info['phone_number'], role_info['address']))

            connection.commit()
        
        return {"status": "success", "message": "User and related record inserted successfully."}
    
    except Exception as e:
        return {"status": "error", "message": f"Error has occurred: {str(e)}"}

    finally:
        if connection:
            close_db_connection(connection)
            




