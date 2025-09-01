import { fetchUserData } from './api.js';
import { createCard } from './card.js';
import { Logger } from './utils.js';

/**
 * Tillståndshantering för kortexpansion
 */
class CardState {
    constructor() {
        this.expandedCardId = null;
        this.users = [];
    }

    setExpandedCard(cardId) {
        this.expandedCardId = cardId;
    }

    getExpandedCard() {
        return this.expandedCardId;
    }

    setUsers(users) {
        this.users = users;
    }

    getUsers() {
        return this.users;
    }
}

// Global tillståndsinstans
const cardState = new CardState();

/**
 * Skapar reservanvändare vid API-fel eller file:// protokoll
 */
function createFallbackUsers() {
    return [
        {
            name: 'Alex Cipher',
            email: 'alex.cipher@nexus.net',
            phone: '+46 70 123 4567',
            address: { city: 'Stockholm', country: 'Sverige' },
            picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=transparent',
            gender: 'man',
            age: 28,
            registered: '2020-03-15T10:30:00Z',
            nationality: 'SE'
        },
        {
            name: 'Nova Sterling',
            email: 'nova.sterling@nexus.net',
            phone: '+46 70 234 5678',
            address: { city: 'Göteborg', country: 'Sverige' },
            picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova&backgroundColor=transparent',
            gender: 'kvinna',
            age: 32,
            registered: '2019-08-22T14:45:00Z',
            nationality: 'SE'
        },
        {
            name: 'Zara Quantum',
            email: 'zara.quantum@nexus.net',
            phone: '+46 70 345 6789',
            address: { city: 'Malmö', country: 'Sverige' },
            picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara&backgroundColor=transparent',
            gender: 'kvinna',
            age: 26,
            registered: '2021-01-10T09:15:00Z',
            nationality: 'SE'
        }
    ];
}

/**
 * Visar laddningsanimation med svensk text
 */
function showLoading() {
    const userContainer = document.getElementById('user-cards-container');
    if (userContainer) {
        userContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div style="color: var(--primary-quantum); font-size: 1.2rem; animation: pulse 2s infinite;">
                    INITIERAR QUANTUM-ANSLUTNING...
                </div>
            </div>
        `;
    }
}

/**
 * Hanterar kortklick för expansion/kollaps
 */
function handleCardClick(event) {
    // Ignorera klick på sociala länkar
    if (event.target.closest('.social')) {
        return;
    }

    const card = event.currentTarget;
    const cardId = card.dataset.userId;
    
    // Stäng tidigare expanderat kort
    const previouslyExpanded = document.querySelector('.card.expanded');
    if (previouslyExpanded && previouslyExpanded !== card) {
        previouslyExpanded.classList.remove('expanded');
        const hiddenInfo = previouslyExpanded.querySelector('.hidden-info');
        const expandIndicator = previouslyExpanded.querySelector('.expand-indicator');
        if (hiddenInfo) {
            hiddenInfo.classList.remove('visible');
        }
        if (expandIndicator) {
            expandIndicator.classList.remove('rotated');
            const span = expandIndicator.querySelector('span');
            if (span) span.textContent = 'Klicka för mer info';
        }
    }
    
    // Växla nuvarande kort
    const isCurrentlyExpanded = card.classList.contains('expanded');
    const hiddenInfo = card.querySelector('.hidden-info');
    const expandIndicator = card.querySelector('.expand-indicator');
    
    if (isCurrentlyExpanded) {
        card.classList.remove('expanded');
        if (hiddenInfo) {
            hiddenInfo.classList.remove('visible');
        }
        if (expandIndicator) {
            expandIndicator.classList.remove('rotated');
            const span = expandIndicator.querySelector('span');
            if (span) span.textContent = 'Klicka för mer info';
        }
        cardState.setExpandedCard(null);
    } else {
        card.classList.add('expanded');
        if (hiddenInfo) {
            hiddenInfo.classList.add('visible');
        }
        if (expandIndicator) {
            expandIndicator.classList.add('rotated');
            const span = expandIndicator.querySelector('span');
            if (span) span.textContent = 'Dölj info';
        }
        cardState.setExpandedCard(cardId);
    }
}

/**
 * Lägger till stegvis animation till kort
 */
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

/**
 * Skapar och visar användarkort
 */
function displayUsers(users) {
    const userContainer = document.getElementById('user-cards-container');
    
    if (!userContainer) {
        console.error('Kortcontainer hittades inte!');
        return;
    }
    
    userContainer.innerHTML = '';
    cardState.setUsers(users);
    
    users.forEach((user, index) => {
        try {
            const card = createCard(user);
            card.dataset.userId = `anvandare-${index}`;
            card.addEventListener('click', handleCardClick);
            userContainer.appendChild(card);
        } catch (error) {
            console.error(`Fel vid skapande av kort ${index + 1}:`, error);
        }
    });
    
    setTimeout(animateCards, 100);
}

/**
 * Initialiserar Quantum-applikationen med förbättrad file:// hantering
 */
async function initializeQuantum() {
    showLoading();
    
    try {
        console.log('Försöker hämta data från API...');
        const users = await fetchUserData();
        console.log('API-data mottagen framgångsrikt:', users);
        displayUsers(users);
        console.log('Användare visade från API');
    } catch (error) {
        console.error('API-fel uppstod:', error);
        console.log('Växlar till reservdata (fallback)');
        
        const userContainer = document.getElementById('user-cards-container');
        if (userContainer) {
            // Visa felmeddelande med quantum-färger på svenska
            const isFileProtocol = window.location.protocol === 'file:';
            userContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div style="color: var(--primary-quantum); font-size: 1.3rem; margin-bottom: 1rem; text-shadow: 0 0 10px var(--primary-quantum);">
                        ${isFileProtocol ? '📁 FILE:// PROTOKOLL UPPTÄCKT' : '⚠️ API-ANSLUTNING MISSLYCKADES'}
                    </div>
                    <div style="color: var(--accent-quantum); font-size: 1rem; margin-bottom: 2rem;">
                        ${isFileProtocol ? 'Laddar lokala demoprofiler...' : 'Laddar reservprofiler från lokal databas...'}
                    </div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">
                        ${isFileProtocol ? 'Tips: Använd en HTTP-server för full API-funktionalitet' : `Fel: ${error.message || 'Okänt nätverksfel'}`}
                    </div>
                </div>
            `;
            
            // Vänta och visa reservkort
            setTimeout(() => {
                console.log('Skapar reservanvändare...');
                const fallbackUsers = createFallbackUsers();
                console.log('Reservanvändare skapade:', fallbackUsers);
                displayUsers(fallbackUsers);
                
                // Visa bekräftelse att reservdata laddats
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-card);
                    border: 1px solid var(--accent-quantum);
                    border-radius: 10px;
                    padding: 1rem;
                    color: var(--accent-quantum);
                    font-size: 0.9rem;
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 0 20px var(--accent-quantum);
                `;
                notification.textContent = isFileProtocol ? '✓ Demoprofiler laddade' : '✓ Reservprofiler laddade';
                document.body.appendChild(notification);
                
                // Ta bort notifikation efter 3 sekunder
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);
                
                console.log('Reservkort visade framgångsrikt');
            }, 1000);
        }
    }
}

/**
 * Hanterar uppdateringsknappen för att ladda nya profiler
 */
function handleRefreshProfiles() {
    const refreshBtn = document.getElementById('refresh-profiles-btn');
    if (refreshBtn) {
        // Inaktivera knapp tillfälligt och visa laddningstillstånd
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="animation: spin 1s linear infinite;">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            <span>Laddar...</span>
        `;
        
        // Återställ knapp efter laddning
        setTimeout(() => {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                <span>Nya Profiler</span>
            `;
        }, 2000);
    }
    
    // Ladda nya profiler
    initializeQuantum();
}

/**
 * Initialiserar händelselyssnare
 */
function initializeEventListeners() {
    const refreshBtn = document.getElementById('refresh-profiles-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefreshProfiles);
        console.log('Uppdateringsknapp händelselyssnare tillagd');
    }
}

// Starta applikationen när DOM är laddad
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM laddad - startar Quantum Profile Hub...');
    initializeQuantum();
    initializeEventListeners();
});