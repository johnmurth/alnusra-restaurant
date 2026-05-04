// Firebase Configuration
// Replace with your actual Firebase config
export const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Check for embedded config (for production after download)
let activeConfig = null;

export function getFirebaseConfig() {
    if (activeConfig) return activeConfig;
    
    // Check for embedded config from downloaded file
    if (typeof window.EMBEDDED_FIREBASE_CONFIG !== 'undefined' && window.EMBEDDED_FIREBASE_CONFIG) {
        activeConfig = window.EMBEDDED_FIREBASE_CONFIG;
        return activeConfig;
    }
    
    // Check localStorage
    const saved = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
    if (saved) {
        try {
            activeConfig = JSON.parse(saved);
            return activeConfig;
        } catch(e) {}
    }
    
    return FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config) {
    activeConfig = config;
    localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(config));
}

export function hasValidFirebaseConfig() {
    const config = getFirebaseConfig();
    return config && config.projectId && config.projectId !== 'YOUR_PROJECT_ID';
}