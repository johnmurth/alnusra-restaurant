class MenuService {
    constructor() {
        this.menuCache = null;
        this.listeners = [];
    }
    
    async loadMenu() {
        // Try Firebase first
        if (window.firebaseService && window.firebaseService.isReady) {
            const firebaseMenu = await window.firebaseService.loadMenu();
            if (firebaseMenu && firebaseMenu.length > 0) {
                this.menuCache = firebaseMenu;
                this.saveToLocalStorage(firebaseMenu);
                this.notifyListeners();
                return firebaseMenu;
            }
        }
        
        // Fallback to localStorage
        const localMenu = this.loadFromLocalStorage();
        if (localMenu && localMenu.length > 0) {
            this.menuCache = localMenu;
            this.notifyListeners();
            return localMenu;
        }
        
        // Ultimate fallback to default menu
        this.menuCache = [...DEFAULT_MENU];
        this.saveToLocalStorage(this.menuCache);
        this.notifyListeners();
        return this.menuCache;
    }
    
    async saveMenu(menuItems) {
        this.menuCache = [...menuItems];
        this.saveToLocalStorage(menuItems);
        
        // Try to save to Firebase
        if (window.firebaseService && window.firebaseService.isReady) {
            await window.firebaseService.saveMenu(menuItems);
        }
        
        this.notifyListeners();
        return true;
    }
    
    async addDish(dish) {
        const menu = await this.loadMenu();
        const newId = Math.max(...menu.map(d => d.id), 0) + 1;
        const newDish = { ...dish, id: newId };
        menu.push(newDish);
        await this.saveMenu(menu);
        return newDish;
    }
    
    async updateDish(id, updates) {
        const menu = await this.loadMenu();
        const index = menu.findIndex(d => d.id === id);
        if (index === -1) return null;
        
        menu[index] = { ...menu[index], ...updates };
        await this.saveMenu(menu);
        return menu[index];
    }
    
    async deleteDish(id) {
        const menu = await this.loadMenu();
        const filtered = menu.filter(d => d.id !== id);
        await this.saveMenu(filtered);
        return true;
    }
    
    getDishById(id) {
        if (!this.menuCache) return null;
        return this.menuCache.find(d => d.id === id);
    }
    
    searchDishes(query) {
        if (!this.menuCache) return [];
        const term = query.toLowerCase().trim();
        if (!term) return this.menuCache;
        
        return this.menuCache.filter(dish =>
            dish.name.toLowerCase().includes(term) ||
            dish.cat.toLowerCase().includes(term) ||
            (dish.desc && dish.desc.toLowerCase().includes(term))
        );
    }
    
    getCategories() {
        if (!this.menuCache) return [];
        return [...new Set(this.menuCache.map(d => d.cat))];
    }
    
    getDishesByCategory(category) {
        if (!this.menuCache) return [];
        return this.menuCache.filter(d => d.cat === category);
    }
    
    saveToLocalStorage(menu) {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem(STORAGE_KEYS.MENU);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch(e) {}
        }
        return null;
    }
    
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.menuCache));
    }
}

window.menuService = new MenuService();