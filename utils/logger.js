import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dossierLogs = path.join(__dirname, "..", "logs");
const fichierLogs = path.join(dossierLogs, "app.log");

try {
    if (!fs.existsSync(dossierLogs)) {
        fs.mkdirSync(dossierLogs, { recursive: true });
    }
} catch (error) {
    console.error("Impossible de créer le dossier logs :", error.message);
}

export function journaliser(message) {
    try {
        const date = new Date().toLocaleString("fr-FR");
        const texte = `[${date}] ${message}\n`;
        fs.appendFileSync(fichierLogs, texte, "utf8");
    } catch (error) {
        console.error("Erreur lors de l'écriture du log :", error.message);
    }
}

export function logInfo(message) {
    journaliser(`[INFO] ${message}`);
}

export function logSuccess(message) {
    journaliser(`[SUCCESS] ${message}`);
}

export function logWarning(message) {
    journaliser(`[WARNING] ${message}`);
}

export function logError(message) {
    journaliser(`[ERROR] ${message}`);
}

export { fichierLogs };