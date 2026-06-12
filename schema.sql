-- ============================================================
--  JS TODO App - Database Schema
--  Run with:  mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS todo_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE todo_app;

-- ------------------------------------------------------------
--  Users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100)  NOT NULL,
  email     VARCHAR(150)  NOT NULL UNIQUE,   -- enforces "Email already exists"
  password  VARCHAR(255)  NOT NULL           -- stores bcrypt hash
);

-- ------------------------------------------------------------
--  Tasks
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  userId       INT NOT NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  dueDate      DATE,
  priority     ENUM('Low','Medium','High')      NOT NULL DEFAULT 'Low',
  status       ENUM('Pending','Completed')       NOT NULL DEFAULT 'Pending',
  createdAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_user
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE
);
