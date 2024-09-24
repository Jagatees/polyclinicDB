import os
from sshtunnel import SSHTunnelForwarder
import pymysql
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Debugging: print environment variables
print(f"SSH_LOCAL_PORT: {os.getenv('SSH_LOCAL_PORT')}")
print(f"SSH_REMOTE_PORT: {os.getenv('SSH_REMOTE_PORT')}")

# SSH and MySQL configuration from .env file
ssh_host = os.getenv('SSH_HOST')
ssh_username = os.getenv('SSH_USERNAME')
ssh_password = os.getenv('SSH_PASSWORD')

mysql_user = os.getenv('MYSQL_USER')
mysql_password = os.getenv('MYSQL_PASSWORD')
mysql_db = os.getenv('MYSQL_DB')

ssh_local_port = int(os.getenv('SSH_LOCAL_PORT'))
ssh_remote_port = int(os.getenv('SSH_REMOTE_PORT'))

def get_db_connection():
    # Create an SSH tunnel
    tunnel = SSHTunnelForwarder(
        (ssh_host, 22),
        ssh_username=ssh_username,
        ssh_password=ssh_password,
        remote_bind_address=('127.0.0.1', ssh_remote_port),
        local_bind_address=('127.0.0.1', ssh_local_port)
    ) 
    tunnel.start()

    print(f"SSH Tunnel established on port {ssh_local_port}")

    # Connect to MySQL through the SSH tunnel
    connection = pymysql.connect(
        host='127.0.0.1',  # Localhost through tunnel
        user=mysql_user,
        password=mysql_password,
        database=mysql_db,
        port=ssh_local_port  # The local port forwarded to the remote MySQL
    ) 
    return connection, tunnel

def close_db_connection(connection, tunnel):
    connection.close()
    tunnel.stop()
    print("db connection and ssh tunnel closed")

def test_db(connection):
    # New person details to be added
    new_person_name = 'helloSir'
    new_person_age = 82

    try:
        # Insert a new record into the Persons table
        with connection.cursor() as cursor:
            insert_query = "INSERT INTO Persons (Name, Age) VALUES (%s, %s)"
            cursor.execute(insert_query, (new_person_name, new_person_age))
            connection.commit()  # Commit the transaction
            print(f"Record inserted: {new_person_name}, {new_person_age} years old")
    finally:
        connection.close()

# to test db connection if needed
#if __name__ == "__main__":
    #connection, tunnel = get_db_connection()
    
    #try:
        #test_db(connection)
    #finally:
        #close_db_connection(connection, tunnel)

