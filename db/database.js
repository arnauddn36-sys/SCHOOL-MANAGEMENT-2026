// db/database.js
// Ce fichier crée la base de données SQLite et la remplit avec des données de démonstration.

import Database from "better-sqlite3"; // Driver SQLite synchrone pour Node.js

const bd = new Database("database.db"); // Ouvre (ou crée) le fichier database.db

bd.pragma("foreign_keys = ON"); // Active la vérification des clés étrangères

// ==========================
// RESET DEVELOPPEMENT
// ==========================
// On supprime les tables à chaque démarrage pour repartir sur une base propre en développement.
bd.exec(`
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS absences;
DROP TABLE IF EXISTS teacher_subjects;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;
`);

// ==========================
// UTILISATEURS
// ==========================
// Table centrale de connexion : chaque compte (admin, professeur, élève) est un utilisateur.
bd.exec(`
CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    password TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL
);
`);

const insererUtilisateurs = bd.prepare(`
INSERT INTO users(nom, prenom, password, role)
VALUES(?,?,?,?)
`); // Requête préparée pour insérer un utilisateur

insererUtilisateurs.run("Den", "Arnaud", "0123", "admin");     // Compte administrateur de démonstration
insererUtilisateurs.run("Bob", "LeBon", "1234", "teacher");    // Compte professeur de démonstration
insererUtilisateurs.run("Jean", "Martin", "0000", "student");  // Compte élève de démonstration

// ==========================
// ÉLÈVES
// ==========================
// user_id relie (optionnellement) un élève à son compte de connexion (role = student).
bd.exec(`
CREATE TABLE students(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricule TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    age INTEGER NOT NULL,
    classe TEXT NOT NULL,
    user_id INTEGER UNIQUE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);
`);

const insererEleves = bd.prepare(`
INSERT INTO students(matricule, nom, prenom, age, classe, user_id)
VALUES(?,?,?,?,?,?)
`);

insererEleves.run("MAT-2026-021", "Kouadio", "Menelick", 18, "1er A1", null); // Élève sans compte lié
insererEleves.run("MAT-2026-022", "Diallo", "Amoin", 19, "1er A1", null);     // Élève sans compte lié
insererEleves.run("MAT-2026-023", "Martin", "Jean", 17, "1er A1", 3);         // Lié au compte élève (user id 3)

// ==========================
// PROFESSEURS
// ==========================
// user_id relie (optionnellement) un professeur à son compte de connexion (role = teacher).
bd.exec(`
CREATE TABLE teachers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    user_id INTEGER UNIQUE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);
`);

const insererProfesseurs = bd.prepare(`
INSERT INTO teachers(nom, prenom, user_id)
VALUES(?,?,?)
`);

insererProfesseurs.run("Bon", "Bob", 2);            // Professeur lié au compte "Bob LeBon" (user id 2)
insererProfesseurs.run("Dramane", "Schella", null); // Professeur sans compte de connexion

// ==========================
// MATIÈRES
// ==========================
bd.exec(`
CREATE TABLE subjects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE
);
`);

const insererMatieres = bd.prepare(`
INSERT INTO subjects(nom)
VALUES(?)
`);

insererMatieres.run("Mathématiques"); // Matière 1
insererMatieres.run("Français");      // Matière 2

// ==========================
// RELATION PROFESSEUR - MATIERE
// ==========================
bd.exec(`
CREATE TABLE teacher_subjects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
`);

const insererProfesseurMatiere = bd.prepare(`
INSERT INTO teacher_subjects(teacher_id, subject_id)
VALUES(?,?)
`);

insererProfesseurMatiere.run(1, 1); // Bob Bon enseigne les Mathématiques
insererProfesseurMatiere.run(2, 2); // Dramane Schella enseigne le Français

// ==========================
// NOTES
// ==========================
bd.exec(`
CREATE TABLE grades(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    note REAL NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
`);

const insererNotes = bd.prepare(`
INSERT INTO grades(student_id, subject_id, note)
VALUES(?,?,?)
`);

insererNotes.run(1, 1, 15.5); // Note de Kouadio Menelick en Mathématiques
insererNotes.run(2, 2, 16);   // Note de Diallo Amoin en Français
insererNotes.run(3, 1, 12.5); // Note de Jean Martin en Mathématiques

// ==========================
// ABSENCES
// ==========================
bd.exec(`
CREATE TABLE absences(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);
`);

const dateDuJour = new Date().toISOString().split("T")[0]; // Date du jour au format AAAA-MM-JJ

const insererAbsences = bd.prepare(`
INSERT INTO absences(student_id, date, status)
VALUES(?,?,?)
`);

insererAbsences.run(1, dateDuJour, "Justifié");     // Absence justifiée de Kouadio Menelick
insererAbsences.run(3, dateDuJour, "Non-justifié"); // Absence non justifiée de Jean Martin

// EXPORT
export default bd; // On exporte la connexion pour l'utiliser dans les services
