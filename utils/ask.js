import readline from "node:readline";

const interfaceLigne = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export function demander(question) {
    return new Promise((resoudre) => {
        interfaceLigne.question(question, (reponse) => {
            resoudre(reponse);
        });
    });
}
