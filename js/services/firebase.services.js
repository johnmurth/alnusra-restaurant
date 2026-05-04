class FirebaseService {
    constructor() {
        this.db = null;
        this.storage = null;
        this.isReady = false;
        this.initPromise = null;
    }
    
    async init() {
        if (this.initPromise) return this.initPromise;
        
        this.initPromise = new Promise(async (resolve) => {
            try {
                const config = getFirebaseConfig();
                if (!hasValidFirebaseConfig()) {
                    console.warn('No valid Firebase config');
                    this.isReady = false;
                    resolve(false);
                    return;
                }
                
                if (firebase.apps.length === 0) {
                    firebase.initializeApp(config);
                }
                
                this.db = firebase.firestore();
                this.storage = firebase.storage();
                this.isReady = true;
                resolve(true);
            } catch (error) {
                console.error('Firebase initialization failed:', error);
                this.isReady = false;
                resolve(false);
            }
        });
        
        return this.initPromise;
    }
    
    async saveMenu(menuItems) {
        if (!this.isReady) return false;
        
        try {
            await this.db.collection('menu').doc('dishes').set({
                items: menuItems,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Failed to save menu to Firebase:', error);
            return false;
        }
    }
    
    async loadMenu() {
        if (!this.isReady) return null;
        
        try {
            const doc = await this.db.collection('menu').doc('dishes').get();
            if (doc.exists && doc.data().items) {
                return doc.data().items;
            }
            return null;
        } catch (error) {
            console.error('Failed to load menu from Firebase:', error);
            return null;
        }
    }
    
    async logOrder(orderData) {
        if (!this.isReady) return false;
        
        try {
            await this.db.collection('orders').add({
                ...orderData,
                timestamp: new Date().toISOString(),
                ts: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Failed to log order:', error);
            return false;
        }
    }
    
    async loadOrders(limit = 200) {
        if (!this.isReady) return [];
        
        try {
            const snapshot = await this.db
                .collection('orders')
                .orderBy('ts', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Failed to load orders:', error);
            return [];
        }
    }
    
    async uploadImage(file, path) {
        if (!this.isReady) return null;
        
        return new Promise((resolve, reject) => {
            const ext = file.name.split('.').pop() || 'jpg';
            const fullPath = `${path}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
            const ref = this.storage.ref(fullPath);
            const task = ref.put(file);
            
            task.on(
                'state_changed',
                null,
                (error) => reject(error),
                async () => {
                    const url = await ref.getDownloadURL();
                    resolve(url);
                }
            );
        });
    }
}

window.firebaseService = new FirebaseService();