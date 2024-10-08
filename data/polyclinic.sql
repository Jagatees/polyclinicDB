-- DROP DATABASE polyclinic;

CREATE DATABASE polyclinic;

USE polyclinic;

CREATE TABLE role(
    role_id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL,
    PRIMARY KEY(role_id)
);

CREATE TABLE user (
    user_id INT NOT NULL AUTO_INCREMENT,
    role_id_fk INT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(800) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY (role_id_fk) REFERENCES role(role_id) ON DELETE CASCADE
);

CREATE TABLE patient(
    patient_id INT NOT NULL AUTO_INCREMENT,
    user_id_fk INT NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(9) CHECK(gender = 'M' OR gender = 'F'),
    phone_number VARCHAR(8) NOT NULL UNIQUE,
    address VARCHAR(500) NOT NULL,
    PRIMARY KEY(patient_id),
    FOREIGN KEY(user_id_fk) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE TABLE medical_condition(
    condition_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL,
    PRIMARY KEY(condition_id)
);

CREATE TABLE doctor(
    doctor_id INT NOT NULL AUTO_INCREMENT,
    user_id_fk INT NOT NULL,
    phone_number VARCHAR(8) NOT NULL UNIQUE,
    specialty VARCHAR(255) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE, 
    PRIMARY KEY(doctor_id),
    FOREIGN KEY(user_id_fk) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE TABLE medication(
    medication_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(medication_id)
);

CREATE TABLE patient_medication(
    pat_med_id INT NOT NULL AUTO_INCREMENT,
    patient_id_fk INT NOT NULL,
    medication_id_fk INT NOT NULL,
    doctor_id_fk INT NOT NULL,
    dosage INT NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    PRIMARY KEY(pat_med_id),
    FOREIGN KEY(patient_id_fk) REFERENCES patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY(medication_id_fk) REFERENCES medication(medication_id) ON DELETE CASCADE,
    FOREIGN KEY(doctor_id_fk) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

CREATE TABLE appointment(
    appointment_id INT NOT NULL,
    patient_id_fk INT NOT NULL,
    doctor_id_fk INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    PRIMARY KEY(appointment_id, patient_id_fk),
    FOREIGN KEY(patient_id_fk) REFERENCES patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY(doctor_id_fk) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

CREATE TABLE billing(
    billing_id INT NOT NULL,
    patient_id_fk INT	NOT NULL,
    appointment_id_fk INT NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    billing_date DATE NOT NULL,
    payment_status VARCHAR(255) NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    PRIMARY KEY(billing_id, appointment_id_fk),
    FOREIGN KEY(appointment_id_fk) REFERENCES appointment(appointment_id) ON DELETE CASCADE,
	FOREIGN KEY(patient_id_fk) REFERENCES appointment(patient_id_fk) ON DELETE CASCADE
);

CREATE TABLE diagnosis(
    diagnosis_id INT NOT NULL AUTO_INCREMENT,
    patient_id_fk INT NOT NULL,
    condition_id_fk INT NOT NULL,
    doctor_id_fk INT NOT NULL,
    diagnosis_date DATE NOT NULL,
    severity VARCHAR(500) NOT NULL,
    PRIMARY KEY(diagnosis_id),
    FOREIGN KEY(patient_id_fk) REFERENCES patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY(condition_id_fk) REFERENCES medical_condition(condition_id) ON DELETE CASCADE,
    FOREIGN KEY(doctor_id_fk) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);