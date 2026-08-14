// db/database.js
import Database from "better-sqlite3";

const bd = new Database("database.db");

bd.pragma("foreign_keys = ON");

// ==========================
// CRÉATION DES TABLES
// ==========================

bd.exec(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS students(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricule TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    age INTEGER NOT NULL,
    classe TEXT NOT NULL,
    user_id INTEGER UNIQUE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS teachers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    user_id INTEGER UNIQUE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS subjects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS teacher_subjects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grades(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    note REAL NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS absences(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);
`);

export default bd;