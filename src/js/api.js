/**
 * Hämtar användardata från randomuser.me API med förbättrad felhantering
 * Automatisk fallback för file:// protokoll (CORS-problem)
 * @returns {Promise<Array>} Array med användarobjekt
 * @throws {Error} Kastar fel vid API-problem för hantering i main.js
 */
async function fetchUserData() {
    try {
        // Kontrollera om vi kör från file:// protokoll
        if (window.location.protocol === 'file:') {
            console.log('File:// protokoll upptäckt - hoppar över API-anrop på grund av CORS-begränsningar');
            throw new Error('CORS-begränsning: Kan inte göra API-anrop från file:// protokoll');
        }

        console.log('Initierar API-förfrågan till randomuser.me...');
        
        // Timeout för API-förfrågan (5 sekunder för snabbare fallback)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('https://randomuser.me/api/?results=3', {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        // Kontrollera HTTP-status
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Kontrollera Content-Type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Servern returnerade inte JSON-data');
        }
        
        const data = await response.json();
        console.log('API-data mottagen framgångsrikt:', data);
        
        // Validera API-svar struktur
        if (!data || !data.results || !Array.isArray(data.results)) {
            throw new Error('Ogiltig API-svar struktur');
        }
        
        if (data.results.length === 0) {
            throw new Error('API returnerade inga användare');
        }
        
        // Transformera och validera API-data till vårt format
        const transformedUsers = data.results.map((user, index) => {
            try {
                return {
                    name: `${user.name?.first || 'Okänd'} ${user.name?.last || 'Användare'}`,
                    email: user.email || `anvandare${index}@exempel.se`,
                    phone: user.phone || '+46 70 000 0000',
                    address: {
                        city: user.location?.city || 'Okänd stad',
                        country: user.location?.country || 'Okänt land'
                    },
                    picture: user.picture?.large || user.picture?.medium || `https://api.dicebear.com/7.x/avataaars/svg?seed=anvandare${index}`,
                    gender: user.gender || 'okänd',
                    age: user.dob?.age || 25,
                    registered: user.registered?.date || new Date().toISOString(),
                    nationality: user.nat || 'XX'
                };
            } catch (transformError) {
                console.warn(`Fel vid transformering av användare ${index}:`, transformError);
                // Returnera standardanvändare vid transformeringsfel
                return {
                    name: `Användare ${index + 1}`,
                    email: `anvandare${index}@quantum.net`,
                    phone: '+46 70 000 0000',
                    address: { city: 'Stockholm', country: 'Sverige' },
                    picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=anvandare${index}`,
                    gender: 'okänd',
                    age: 25,
                    registered: new Date().toISOString(),
                    nationality: 'SE'
                };
            }
        });
        
        console.log(`Framgångsrikt transformerade ${transformedUsers.length} användare från API`);
        return transformedUsers;
        
    } catch (error) {
        // Detaljerad felhantering med specifika feltyper på svenska
        let errorMessage = 'Okänt API-fel';
        
        if (error.name === 'AbortError') {
            errorMessage = 'API-förfrågan tog för lång tid (timeout efter 5 sekunder)';
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Nätverksfel - kontrollera internetanslutning eller använd HTTP-server';
        } else if (error.message.includes('HTTP')) {
            errorMessage = `Server fel: ${error.message}`;
        } else if (error.message.includes('JSON')) {
            errorMessage = 'Fel vid tolkning av API-data (JSON-format)';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'CORS-begränsning: Öppna filen via HTTP-server för API-funktionalitet';
        } else {
            errorMessage = error.message;
        }
        
        console.error('API fetchUserData fel:', {
            originalError: error,
            errorMessage: errorMessage,
            protocol: window.location.protocol,
            timestamp: new Date().toISOString()
        });
        
        // Kasta fel med förbättrat meddelande för hantering i main.js
        const enhancedError = new Error(errorMessage);
        enhancedError.originalError = error;
        enhancedError.timestamp = new Date().toISOString();
        enhancedError.isFileProtocol = window.location.protocol === 'file:';
        
        throw enhancedError;
    }
}

export { fetchUserData };