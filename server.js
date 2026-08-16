// server.js

import express from "express";
import path from "path";
import "dotenv/config"; // Chargement des variables d'environnement depuis le fichier .env
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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

// ==========================
// SÉCURITÉ HTTP (helmet)
// ==========================
// Ajoute automatiquement une série d'en-têtes de sécurité (anti-clickjacking,
// anti-sniffing MIME, masque la techno utilisée, etc.).
// On personnalise la Content-Security-Policy par défaut car elle bloquerait
// sinon FontAwesome (cdnjs.cloudflare.com) et Google Fonts, utilisés dans
// le frontend (teacher.css, global.css...).
application.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:"]
        }
    }
}));

// ==========================
// LIMITATION DES TENTATIVES DE CONNEXION (anti brute-force)
// ==========================
// Limite chaque IP à 5 tentatives de connexion par tranche de 15 minutes.
// Protège /api/auth/login contre les attaques par force brute sur les mots de passe.
const limiteurConnexion = rateLimit({
    windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
    max: 5,                    // 5 tentatives maximum par IP dans cette fenêtre
    message: { message: "Trop de tentatives de connexion. Réessayez dans 15 minutes." },
    standardHeaders: true,     // Renvoie les infos de quota dans les en-têtes RateLimit-*
    legacyHeaders: false
});

// Limite générale, plus permissive, sur le reste de l'API (anti-spam/anti-abus global)
const limiteurGeneral = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,                  // 300 requêtes par IP toutes les 15 minutes
    message: { message: "Trop de requêtes. Réessayez plus tard." },
    standardHeaders: true,
    legacyHeaders: false
});

application.use("/api", limiteurGeneral); // Appliqué à toute l'API

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

// Routes d'authentification (avec limite stricte anti brute-force sur le login)
application.use("/api/auth/login", limiteurConnexion);
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
    console.log(`Accéder à l'application via http://localhost:${PORT}`);
});