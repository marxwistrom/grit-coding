import { DateFormatter } from './utils.js';

/**
 * Skapar ett profilkort för en användare
 * @param {Object} user - Användarobjekt med profildata
 * @returns {HTMLElement} - Färdigt profilkort som DOM-element
 */
export function createCard(user) {
    const card = document.createElement('div');
    card.className = 'card';

    // Generera en futuristisk avatar-URL (använder en placeholder-tjänst)
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=transparent`;
    
    // Extrahera roll från e-postdomän eller använd standard
    const role = user.email.includes('admin') ? 'Systemadministratör' : 
                 user.email.includes('dev') ? 'Utvecklare' : 
                 user.email.includes('design') ? 'UI-Designer' : 'Nätverksspecialist';

    // Formatera datum med DateFormatter
    const registeredDate = DateFormatter.formatDate(user.registered);
    const timeSinceRegistration = DateFormatter.getTimeSinceRegistration(user.registered);

    card.innerHTML = `
        <img src="${avatarUrl}" alt="${user.name}" class="profile-image" />
        
        <div class="card-body">
            <h2>${user.name}</h2>
            <div class="role">${role}</div>
            
            <div class="info">
                <div class="info-item">
                    <span class="info-icon"></span>
                    <span>${user.email}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon"></span>
                    <span>${user.phone}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon"></span>
                    <span>${user.address?.city || 'Distans'}</span>
                </div>
            </div>
            
            <div class="hidden-info">
                <div class="extra-details">
                    <h3>Detaljerad Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Ålder:</span>
                            <span class="detail-value">${user.age} år</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Kön:</span>
                            <span class="detail-value">${user.gender === 'man' ? 'Man' : user.gender === 'kvinna' ? 'Kvinna' : 'Okänt'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Nationalitet:</span>
                            <span class="detail-value">${user.nationality}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Registrerad:</span>
                            <span class="detail-value">${registeredDate}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Medlem sedan:</span>
                            <span class="detail-value">${timeSinceRegistration}</span>
                        </div>
                    </div>
                    
                    <div class="security-clearance">
                        <div class="clearance-level">
                            <span class="clearance-dot level-${Math.floor(Math.random() * 3) + 1}"></span>
                            <span>Säkerhetsnivå: ${['GRUNDLÄGGANDE', 'FÖRHÖJD', 'MAXIMAL'][Math.floor(Math.random() * 3)]}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="status">
                <span class="status-dot"></span>
                <span>ONLINE</span>
            </div>
            
            <div class="social">
                <a href="mailto:${user.email}" title="Skicka meddelande">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                </a>
                <a href="tel:${user.phone}" title="Röstsamtal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                </a>
                <a href="#" title="Nätverksprofil">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </a>
            </div>
            
            <div class="expand-indicator">
                <span>Klicka för mer info</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
            </div>
        </div>
    `;

    // Lägg till reservhantering för när bilder misslyckas att ladda
    const img = card.querySelector('.profile-image');
    img.addEventListener('error', function() {
        // Ta bort src för att utlösa CSS-reservstyling
        this.removeAttribute('src');
        this.setAttribute('data-fallback', 'true');
        this.setAttribute('title', `${user.name} - Avatar ej tillgänglig`);
    });

    return card;
}