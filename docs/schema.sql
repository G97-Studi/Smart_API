-- SmartRepair API database schema
-- Run with: mysql -u root -p < docs/schema.sql

CREATE DATABASE IF NOT EXISTS smartrepair_db;
USE smartrepair_db;

CREATE TABLE IF NOT EXISTS Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Devices (
    device_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    issue_description TEXT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RepairTickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    device_id INT NOT NULL,
    issue TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    priority VARCHAR(20) DEFAULT 'Medium',
    estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES Devices(device_id)
        ON DELETE CASCADE
);

-- Planned, not yet used by any route (Milestone 4/5 scope)
CREATE TABLE IF NOT EXISTS Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    ticket_id INT NOT NULL,
    appointment_date DATE,
    appointment_time TIME,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Scheduled',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES RepairTickets(ticket_id)
        ON DELETE CASCADE
);

-- Sample data for testing GET routes
INSERT INTO Customers (full_name, email, phone, address) VALUES
    ('Jane Doe', 'jane@example.com', '555-0101', '123 Main St'),
    ('John Smith', 'john@example.com', '555-0102', '456 Oak Ave');

INSERT INTO Devices (customer_id, device_type, brand, model, serial_number, issue_description) VALUES
    (1, 'Laptop', 'Dell', 'XPS 13', 'SN12345', 'Won''t power on'),
    (2, 'Phone', 'Apple', 'iPhone 13', 'SN67890', 'Cracked screen');

INSERT INTO RepairTickets (customer_id, device_id, issue, status, priority, estimated_cost) VALUES
    (1, 1, 'Motherboard diagnosis needed', 'Pending', 'High', 120.00),
    (2, 2, 'Screen replacement', 'In Progress', 'Medium', 89.99);
