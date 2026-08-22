// db/database.js

import Database from "better-sqlite3"; // Driver SQLite synchrone pour Node.js

const bd = new Database("database.db"); // Ouvre (ou crée) le fichier database.db

bd.pragma("foreign_keys = ON"); // Active la vérification des clés étrangères

// ==========================
// CRÉATION DES TABLES
// ==========================
// IF NOT EXISTS : la structure n'est créée qu'une seule fois, à la toute
// première exécution. Les redémarrages suivants n'y touchent plus,
// donc les données existantes ne sont jamais effacées.

// UTILISATEURS
// Table centrale de connexion : chaque compte (admin, professeur, élève) est un utilisateur.
bd.exec(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);
`);

// ÉLÈVES
// user_id relie (optionnellement) un élève à son compte de connexion (role = student).
bd.exec(`
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
`);

// PROFESSEURS
// user_id relie (optionnellement) un professeur à son compte de connexion (role = teacher).
bd.exec(`
CREATE TABLE IF NOT EXISTS teachers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    user_id INTEGER UNIQUE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);
`);

// MATIÈRES
bd.exec(`
CREATE TABLE IF NOT EXISTS subjects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE
);
`);

// RELATION PROFESSEUR - MATIERE
bd.exec(`
CREATE TABLE IF NOT EXISTS teacher_subjects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
`);

// NOTES
bd.exec(`
CREATE TABLE IF NOT EXISTS grades(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    note REAL NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
`);

// ABSENCES
bd.exec(`
CREATE TABLE IF NOT EXISTS absences(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);
`);

// ==========================
// ADMIN UNIQUE PAR DÉFAUT
// ==========================
// Crée un seul compte admin, une seule fois (jamais recréé si un admin existe
// déjà). Utile notamment sur Render (plan gratuit) où le Shell n'est pas
// disponible pour insérer un premier compte manuellement.
// Le mot de passe ci-dessous est déjà haché avec bcrypt (10 tours) et
// correspond à "Admin123!" — change-le si tu veux, via bcrypt.hashSync().
const nombreAdmins = bd.prepare(`
    SELECT COUNT(*) AS total FROM users WHERE role = 'admin'
`).get();

if (nombreAdmins.total === 0) {

    bd.prepare(`
        INSERT INTO users (nom, prenom, email, password, role)
        VALUES (?, ?, ?, ?, ?)
    `).run(
        "Admin",
        "Principal",
        "admin.principal@gmail.com",
        "$2b$10$gv/XjBpaRwUvQilc9hJFteytk/4B0y7pH60opKVXTwvgVVn74pETm",
        "admin"
    );

    console.log("Compte admin par défaut créé : admin.principal@gmail.com / Admin123!");

}

// EXPORT
export default bd; // On exporte la connexion pour l'utiliser dans les services