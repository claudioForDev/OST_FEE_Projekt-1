Die Vorlage beinhaltet CSS/JS-Linter und Prettier. Diese sind konfiguriert.

Getting Started

1. Entzippen von der Vorlage.
2. Installieren Sie die Dependencies der Vorlage
    - Console/Terminal: «npm install» im Root vom Projekt
3. Testen Sie, ob alles richtig installiert wurde
    - Console: «npm run eslint» im Root vom Projekt
    - Erwarte Ausgabe: 2 Warnungen
4. Prettier und ESLint in der IDE Konfigurieren
    - https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
    - https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
        - VS Code: Format on Save aktivieren

Woche 3

- HTML Gerüst erstellen für die Wireframes und Beginn CSS:
    - /code/public/index.html
    - /code/public/styles/index.css
    - /code/public/index.html "ausführen".
        - Live Server nutzen: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

Folgende Befehle sind möglich

| Befehl              | Beschreibung                                            |
| ------------------- | ------------------------------------------------------- |
| npm run start       | Started den Web-Server: http://localhost:3000           |
| npm run start:watch | Started den Web-Server mit watch: http://localhost:3000 |
| npm run lint        | Testet ob die JS / CSS Files in Ordnung sind.           |
| npm run format      | Formatiert Dateien automatisch mit Prettier.            |
| npm run format:check| Prüft ob Dateien korrekt formatiert sind.               |
