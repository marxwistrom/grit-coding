/**
 * Hjälpklass för datumformatering
 */
class DateFormatter {
    /**
     * Formaterar ISO-datum till läsbart format
     * @param {string} isoDate - ISO datum sträng
     * @returns {string} Formaterat datum
     */
    static formatDate(isoDate) {
        const date = new Date(isoDate);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('sv-SE', options);
    }

    /**
     * Beräknar tid sedan registrering
     * @param {string} registeredDate - Registreringsdatum
     * @returns {string} Tid sedan registrering
     */
    static getTimeSinceRegistration(registeredDate) {
        const now = new Date();
        const registered = new Date(registeredDate);
        const diffTime = Math.abs(now - registered);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) {
            return `${diffDays} dagar sedan`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} månader sedan`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} år sedan`;
        }
    }
}

/**
 * Hjälpklass för loggning och debugging
 */
class Logger {
    static logLevel = 'info'; // 'debug', 'info', 'warn', 'error'

    /**
     * Loggar debug-meddelanden
     * @param {string} message - Meddelande att logga
     * @param {any} data - Extra data att logga
     */
    static debug(message, data = null) {
        if (this.logLevel === 'debug') {
            console.log(`🔧 [DEBUG] ${message}`, data || '');
        }
    }

    /**
     * Loggar info-meddelanden
     * @param {string} message - Meddelande att logga
     * @param {any} data - Extra data att logga
     */
    static info(message, data = null) {
        if (['debug', 'info'].includes(this.logLevel)) {
            console.log(`ℹ️ [INFO] ${message}`, data || '');
        }
    }

    /**
     * Loggar varningar
     * @param {string} message - Meddelande att logga
     * @param {any} data - Extra data att logga
     */
    static warn(message, data = null) {
        if (['debug', 'info', 'warn'].includes(this.logLevel)) {
            console.warn(`⚠️ [WARN] ${message}`, data || '');
        }
    }

    /**
     * Loggar fel
     * @param {string} message - Meddelande att logga
     * @param {any} error - Fel-objekt att logga
     */
    static error(message, error = null) {
        console.error(`❌ [ERROR] ${message}`, error || '');
    }

    /**
     * Sätter logg-nivå
     * @param {string} level - Ny logg-nivå
     */
    static setLogLevel(level) {
        this.logLevel = level;
        this.info(`Log level set to: ${level}`);
    }
}

export { DateFormatter, Logger };
