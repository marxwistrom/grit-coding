# Quantum-profile-hub

En futuristisk webbapplikation som visar användarprofilkort med cyberpunk-estetik. Applikationen hämtar användardata från RandomUser.me API och presenterar dem i interaktiva, expanderbara kort med glassmorfism-effekter och neonanimationer.

## ✨ Funktioner

- **🌌 Futuristisk Design**: Mörkt cyberpunk-tema med neonblå, magenta och grön färgpalett
- **🔮 Glassmorfism-effekter**: Genomskinliga kort med bakgrundsoskärpa
- **⚡ Interaktiva Kort**: Klickbara kort som expanderar för att visa detaljerad information
- **🎯 State Management**: Intelligent hantering av kortexpansion med `CardState` klass
- **🛡️ Robust Felhantering**: Try/catch med fallback-profiler vid API-fel
- **📱 Responsiv Design**: Optimerad för både desktop och mobila enheter
- **🎨 Animationer**: Staggered laddningsanimationer och hover-effekter

## 🏗️ Projektstruktur

```
my-frontend-project-1/
├── src/
│   ├── css/
│   │   └── styles.css          # Futuristiska stilar med CSS Grid och animationer
│   └── js/
│       ├── api.js              # RandomUser.me API integration
│       ├── card.js             # Dynamisk kortskapning med expanderbar info
│       ├── main.js             # Huvudlogik med state management
│       └── utils.js            # Hjälpklasser (DateFormatter, Logger)
├── index.html                  # Huvudsida med futuristisk layout
└── README.md
```

## 🚀 Kom Igång

### Förutsättningar
- Modern webbläsare med ES6+ stöd
- Internetanslutning för API-anrop

### Installation

1. **Klona projektet**:
   ```bash
   git clone <repository-url>
   cd my-frontend-project-1
   ```

2. **Öppna applikationen**:
   - Dubbelklicka på `index.html`, eller
   - Använd en lokal webbserver:
   ```bash
   # Med Python
   python -m http.server 8000
   
   # Med Node.js (http-server)
   npx http-server
   ```

3. **Öppna i webbläsare**:
   Navigera till `http://localhost:8000` (om du använder webbserver)

## 🎮 Användning

1. **Ladda Profiler**: Applikationen hämtar automatiskt 3 slumpmässiga användarprofiler
2. **Expandera Kort**: Klicka på ett kort för att visa detaljerad information
3. **Navigera**: Endast ett kort kan vara expanderat åt gången
4. **Felhantering**: Vid API-fel visas fallback-profiler automatiskt

## 📋 API Integration

Applikationen använder [RandomUser.me API](https://randomuser.me/) för att hämta realistisk användardata:

```javascript
// Hämtar 3 användare
fetch('https://randomuser.me/api/?results=3')
```

**Transformerad data inkluderar**:
- Namn, email, telefon
- Profilbild, ålder, kön
- Adress och nationalitet
- Registreringsdatum

## 🏛️ Arkitektur

### Klasser och Moduler

- **`CardState`**: State management för kortexpansion
- **`DateFormatter`**: Formatering av datum och tidsberäkningar
- **`Logger`**: Strukturerad loggning med olika nivåer
- **`createCard()`**: Dynamisk DOM-generering av profilkort
- **`fetchUserData()`**: API-integration med felhantering

### Design Patterns

- **Module Pattern**: ES6 imports/exports
- **State Pattern**: Centraliserad state management
- **Observer Pattern**: Event-driven kortinteraktioner
- **Factory Pattern**: Dynamisk kortskapning

## 🎨 Teknisk Implementation

### CSS Features
- CSS Custom Properties (variabler)
- CSS Grid för responsiv layout
- Keyframe-animationer för bakgrund och effekter
- Backdrop-filter för glassmorfism
- Transform och transition för interaktioner

### JavaScript Features
- ES6+ syntax (classes, arrow functions, async/await)
- Fetch API för HTTP-förfrågningar
- DOM manipulation med appendChild()
- Event delegation och handling
- Try/catch felhantering

## 🔧 Anpassning

### Färgtema
Ändra CSS-variabler i `styles.css`:
```css
:root {
  --primary-neon: #00ffff;    /* Cyan */
  --secondary-neon: #ff00ff;  /* Magenta */
  --accent-neon: #00ff41;     /* Grön */
}
```

### API-konfiguration
Modifiera `api.js` för olika datakällor:
```javascript
const API_URL = 'https://randomuser.me/api/?results=5'; // Fler användare
```

### Loggning
Justera logg-nivå i `main.js`:
```javascript
Logger.setLogLevel('debug'); // debug, info, warn, error
```

## 🐛 Felsökning

### Vanliga Problem

1. **CORS-fel**: Använd lokal webbserver istället för file://-protokoll
2. **API inte tillgängligt**: Fallback-profiler laddas automatiskt
3. **Animationer fungerar inte**: Kontrollera att CSS-variabler stöds

### Debug-läge
Aktivera detaljerad loggning:
```javascript
Logger.setLogLevel('debug');
```

## 📄 Licens

MIT - Marx Wiström - This project is licensed under the MIT License; 

## 🤝 Bidrag

Bidrag välkomnas! Vänligen:
1. Forka projektet
2. Skapa en feature branch
3. Commita dina ändringar
4. Pusha till branchen
5. Öppna en Pull Request

---

**Utvecklat för JavaScript 1 Examination - GRIT**
