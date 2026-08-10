// server.js

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import routesUtilisateurs from "./routes/userRoutes.js";
import routesAuthentification from "./routes/authRoutes.js";
import routesStatistiques from "./routes/statsRoutes.js";
import routesProfesseurs from "./routes/teacherRoutes.js";
import routesMatieres from "./routes/subjectRoutes.js";
import routesNotes from "./routes/gradeRoutes.js";
import routesEleves from "./routes/studentRoutes.js";
import routesAbsences from "./routes/absenceRoutes.js";
import { journaliser } from "./utils/logger.js";

// Création du serveur Express
const application = express();

// Gestion du chemin du projet
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Permet de récupérer les données des formulaires HTML
application.use(express.urlencoded({ extended: true }));

// Permet de recevoir des données JSON
application.use(express.json());

// Rend le dossier public accessible
application.use(express.static(path.join(__dirname, "public")));

// Routes de statistiques

application.use("/api/stats", routesStatistiques);

// Routes des utilisateurs

application.use("/api/teachers", routesProfesseurs);

// ROUTES

// Routes d'authentification
application.use("/api/auth", routesAuthentification);

application.use("/api/users", routesUtilisateurs);

// Routes des matières

application.use("/api/subjects", routesMatieres);

// Routes des notes

application.use("/api/grades", routesNotes);

// Routes des élèves

application.use("/api/students", routesEleves);

// Routes des absences

application.use("/api/absences", routesAbsences);

// Route de test
application.get("/", (requete, reponse) => {

    reponse.sendFile(
        path.join(__dirname, "public/html/index.html")
    );

});

// Lancement du serveur
const PORT = process.env.PORT || 3000;

application.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur prêt sur le port ${PORT}`);
    console.log(`Accéder à l'application via http://localhost:${PORT}`);
});