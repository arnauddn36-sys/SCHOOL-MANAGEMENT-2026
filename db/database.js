import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Pool de connexion PostgreSQL / Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Obligatoire pour Supabase et Render
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Événement de connexion
//pool.on("connect", () => {
  //console.log("Connecté au pool PostgreSQL (Supabase)");
//});

pool.on("error", (err) => {
  console.error(" Erreur du pool Supabase :", err);
});

// Initialisation de la structure de la base de données PostgreSQL
async function initialiserBD() {
  try {
    // UTILISATEURS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL
      );
    `);

    // ÉLÈVES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        matricule VARCHAR(50) UNIQUE NOT NULL,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        classe VARCHAR(50) NOT NULL,
        user_id INT UNIQUE REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // PROFESSEURS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        user_id INT UNIQUE REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // MATIÈRES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    // RELATION PROFESSEUR - MATIERE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teacher_subjects (
        id SERIAL PRIMARY KEY,
        teacher_id INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
        subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE
      );
    `);

    // NOTES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS grades (
        id SERIAL PRIMARY KEY,
        student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        note NUMERIC(4,2) NOT NULL
      );
    `);

    // ABSENCES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS absences (
        id SERIAL PRIMARY KEY,
        student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status VARCHAR(50) NOT NULL
      );
    `);

    // ADMIN UNIQUE PAR DÉFAUT
    const res = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'admin'");
    if (parseInt(res.rows[0].total) === 0) {
      await pool.query(`
        INSERT INTO users (nom, prenom, email, password, role)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        "Admin",
        "Principal",
        "admin.principal@gmail.com",
        "$2b$10$gv/XjBpaRwUvQilc9hJFteytk/4B0y7pH60opKVXTwvgVVn74pETm",
        "admin"
      ]);
      console.log(" Compte admin créé : admin.principal@gmail.com / Admin123!");
    }

  } catch (erreur) {
    console.error(" Erreur lors de l'initialisation des tables :", erreur.message);
  }
}

// Exécution au démarrage
initialiserBD();

export default pool;