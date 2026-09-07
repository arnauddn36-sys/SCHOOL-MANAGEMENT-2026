// server.js

import express from "express";
import path from "path";
import "dotenv/config";
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
import bulletinRoutes from "./routes/bulletinRoutes.js";

import { journaliser, logInfo, logSuccess, logError, logWarning } from "./utils/logger.js";

// ============================================================
// CONFIGURATION
// ============================================================


// ============================================================
// CRÉATION DU SERVEUR EXPRESS
// ============================================================

const application = express();

const PORT = process.env.PORT || 3000;

application.set("trust proxy", 1);

// ============================================================
// GESTION DU CHEMIN DU PROJET
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// SÉCURITÉ HTTP — HELMET
// ============================================================

application.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],

        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],

        scriptSrc: ["'self'"],

        imgSrc: [
          "'self'",
          "data:",
          "https://i.pinimg.com",
        ],
      },
    },
  }),
);

// ============================================================
// LIMITATION DES TENTATIVES DE CONNEXION
// ============================================================

const limiteurConnexion = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    message: "Trop de tentatives de connexion. Réessayez dans 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================
// LIMITATION GÉNÉRALE DE L'API
// ============================================================

const limiteurGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    message: "Trop de requêtes. Réessayez plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

application.use("/api", limiteurGeneral);

// ============================================================
// MIDDLEWARES
// ============================================================

application.use(
  express.urlencoded({
    extended: true,
  }),
);

application.use(express.json());

// ============================================================
// FICHIERS STATIQUES
// ============================================================

application.use(
  express.static(
    path.join(__dirname, "public"),
  ),
);

// ============================================================
// ROUTES
// ============================================================

application.use("/api/stats", routesStatistiques);
application.use("/api/teachers", routesProfesseurs);

application.use("/api/auth/login", limiteurConnexion);
application.use("/api/auth", routesAuthentification);

application.use("/api/users", routesUtilisateurs);
application.use("/api/subjects", routesMatieres);
application.use("/api/grades", routesNotes);
application.use("/api/students", routesEleves);
application.use("/api/absences", routesAbsences);
application.use("/api/bulletins", bulletinRoutes);

// ============================================================
// ROUTE RACINE
// ============================================================

application.get("/", (requete, reponse) => {
  reponse.sendFile(
    path.join(
      __dirname,
      "public/html/accueil.html",
    ),
  );
});

// ============================================================
// DÉMARRAGE DU SERVEUR
// ============================================================

logInfo("Démarrage du serveur...");
journaliser("Tentative de démarrage du serveur...");

const serveur = application.listen(
  PORT,
  "0.0.0.0",
  () => {
    const message = `Serveur démarré sur le port ${PORT}`;

    console.log(
      `Accéder à l'application via http://localhost:${PORT}`,
    );

    logSuccess(message);
    journaliser(message); // Écrit le succès dans le fichier de logs
  },
);

// ============================================================
// GESTION DES ERREURS DU SERVEUR
// ============================================================

serveur.on("error", (error) => {
  console.error(
    " Erreur du serveur :",
    error,
  );

  logError(
    `Erreur du serveur : ${error.message}`,
  );
  journaliser(`Erreur du serveur : ${error.message}`); // Enregistre l'erreur dans le fichier de logs
});