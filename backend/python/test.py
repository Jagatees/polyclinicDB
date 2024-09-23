from insert_queries import insert_user
from delete_queries import delete_user

# Example dummy data for two users
user_1_info = {
    'role_id': 1,
    'username': 'drjamesbrown',
    'password_hash': '5f4dcc3b5aa765d61d8327deb882cf99',  # Example hashed password
    'email': 'james.brown@example.com',
    'created_at': '2023-05-12 08:45:30'
}

user_1_role = {
    'first_name': 'James',
    'last_name': 'Brown',
    'phone_number': '93748503'
}

user_2_info = {
    'role_id': 2,
    'username': 'emilyclark',
    'password_hash': 'd8578edf8458ce06fbc5bb76a58c5ca4',  # Example hashed password
    'email': 'emily.clark@example.com',
    'created_at': '2023-09-15 14:30:10'
}

user_2_role = {
    'first_name': 'Emily',
    'last_name': 'Clark',
    'age': 29,
    'gender': 'Female',
    'phone_number': '87364956',
    'address': '789 Pine Street, Seattle, WA, 98101'
}

# test the functions for the queries
#insert_user(user_1_info, user_1_role) #insert doctor
#insert_user(user_2_info, user_2_role) #insert patient
#delete_user(1, 2) # user_id, role_id