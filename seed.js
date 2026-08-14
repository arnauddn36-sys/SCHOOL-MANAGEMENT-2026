// seed.js
import bd from "./db/database.js";
import bcrypt from "bcrypt";

async function runSeed() {
    const countUsers = bd.prepare("SELECT COUNT(*) as count FROM users").get();

    if (countUsers.count === 0) {
        console.log(" Insertion des comptes de démonstration...");

        const saltRounds = 10;
        const hashAdmin = await bcrypt.hash("0123", saltRounds);
        const hashTeacher = await bcrypt.hash("1234", saltRounds);
        const hashStudent = await bcrypt.hash("0000", saltRounds);

        const insererUtilisateurs = bd.prepare(`
            INSERT INTO users(nom, prenom, email, password, role)
            VALUES(?,?,?,?,?)
        `);

        insererUtilisateurs.run("Den", "Arnaud", "admin@school.com", hashAdmin, "admin");
        insererUtilisateurs.run("Bob", "LeBon", "teacher@school.com", hashTeacher, "teacher");
        insererUtilisateurs.run("Jean", "Martin", "student@school.com", hashStudent, "student");

        console.log(" Comptes de démonstration créés avec succès !");
    } else {
        console.log("ℹ Des utilisateurs existent déjà, pas besoin de seed.");
    }
}

runSeed();