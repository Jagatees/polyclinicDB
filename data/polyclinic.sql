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
    appointment_id INT NOT NULL AUTO_INCREMENT,
    patient_id_fk INT NOT NULL,
    doctor_id_fk INT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    PRIMARY KEY(appointment_id),
    FOREIGN KEY(patient_id_fk) REFERENCES patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY(doctor_id_fk) REFERENCES doctor(doctor_id) ON DELETE SET NULL
);

CREATE TABLE billing(
    billing_id INT NOT NULL AUTO_INCREMENT,
    patient_id_fk INT NOT NULL,
    appointment_id_fk INT NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    billing_date DATE NOT NULL,
    payment_status VARCHAR(255) NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    PRIMARY KEY(billing_id),
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
    FOREIGN KEY(doctor_id_fk) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

USE polyclinic;

ALTER TABLE patient_medication
RENAME COLUMN start_date TO duration;

ALTER TABLE patient_medication
MODIFY COLUMN duration INT;

ALTER TABLE patient_medication
DROP COLUMN end_date;

ALTER TABLE medical_condition
RENAME medication_description;

ALTER TABLE diagnosis
ADD appointment_id_fk INT,
ADD CONSTRAINT fk_diagnosis_appointment
FOREIGN KEY (patient_id_fk, appointment_id_fk) 
REFERENCES appointment (patient_id_fk, appointment_id);

ALTER TABLE diagnosis
DROP COLUMN condition_id_fk,
ADD COLUMN diagnosis_description VARCHAR(255) NOT NULL;

DESCRIBE diagnosis;

SELECT * FROM diagnosis;
DELETE FROM diagnosis where patient_id_fk ='9';
 
DESCRIBE patient_medication;

ALTER TABLE patient_medication
ADD COLUMN diagnosis_id_fk INT;

ALTER TABLE patient_medication
ADD CONSTRAINT fk_diagnosis_patient_medication
FOREIGN KEY (diagnosis_id_fk) REFERENCES diagnosis(diagnosis_id) ON DELETE CASCADE;

ALTER TABLE diagnosis
DROP FOREIGN KEY fk_diagnosis_appointment;

ALTER TABLE diagnosis
ADD CONSTRAINT fk_diagnosis_appointment
FOREIGN KEY (patient_id_fk, appointment_id_fk)
REFERENCES appointment(patient_id_fk, appointment_id)
ON DELETE CASCADE;

ALTER TABLE diagnosis
DROP FOREIGN KEY fk_diagnosis_appointment;

ALTER TABLE diagnosis
ADD CONSTRAINT fk_diagnosis_appointment
FOREIGN KEY (patient_id_fk, appointment_id_fk)
REFERENCES appointment(patient_id_fk, appointment_id)
ON DELETE CASCADE;

SHOW COLUMNS FROM diagnosis;

ALTER TABLE diagnosis
DROP FOREIGN KEY fk_diagnosis_appointment;

ALTER TABLE diagnosis
ADD FOREIGN KEY (appointment_id_fk)
REFERENCES appointment(appointment_id)
ON DELETE CASCADE;

ALTER TABLE diagnosis
MODIFY appointment_id_fk INT;
