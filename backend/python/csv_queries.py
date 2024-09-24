from db_connection import get_db_connection, close_db_connection

import pandas as pd
import pymysql
from pymysql import IntegrityError, OperationalError, DataError

def insert_data_from_csv(csv_file, table_name):
    connection = None
    inserted_rows = 0  # Counter to track the number of inserted rows
    try:
        connection, tunnel = get_db_connection()

        data = pd.read_csv(csv_file)

        with connection.cursor() as cursor:
            # Check if we're dealing with the 'user' table
            cols = list(data.columns)

            if table_name == 'user':
                # If it's the 'user' table, append 'create_at' and use NOW() for the value
                if 'create_at' not in cols:
                    cols.append('create_at')  # Append the column to the list
                    placeholders = ', '.join(['%s'] * (len(cols) - 1)) + ', NOW()'
                else:
                    placeholders = ', '.join(['%s'] * len(cols))
            else:
                placeholders = ', '.join(['%s'] * len(cols))

            # Convert column names list to a proper SQL string
            cols_string = ', '.join(cols)  # Convert list to comma-separated string

            insert_query = f"INSERT INTO {table_name} ({cols_string}) VALUES ({placeholders})"

            for index, row in data.iterrows():
                row_tuple = tuple(row)
                if table_name == 'user' and 'create_at' not in data.columns:
                    cursor.execute(insert_query, row_tuple)
                else:
                    cursor.execute(insert_query, row_tuple)
                
                inserted_rows += 1  # Increment the counter for each successful insertion

            connection.commit()

        return {"status": "success", "message": f"{inserted_rows} rows inserted successfully into {table_name}."}

    except OperationalError as oe:
        print(f"OperationalError: Database operation failed - {str(oe)}")
        if connection:
            connection.rollback()

    except Exception as e:
        print(f"GeneralError: An error occurred - {str(e)}")
        if connection:
            connection.rollback()
        return {"status": "error", "message": f"Error occurred: {str(e)}"}

    finally:
        if connection:
            close_db_connection(connection, tunnel)



