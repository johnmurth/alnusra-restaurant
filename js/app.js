class App {
    constructor() {
        this.currentTab = 'menu';
        this.components = {};
        this.views = {};
    }
    
    async init() {
        // Initialize Firebase
        await window.firebaseService.init();
        
        // Load settings
        this.loadSettings();
        
        // Initialize components
        this.initComponents();
        
        // Initialize views
        this.initViews();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        await this.loadInitialData();
        
        // Generate QR code
        if (this.components.qrcode) {
            this.components.qrcode.generate(window.location.href);
        }
        
        // Check for dish highlight from URL
        this.checkUrlHighlight();
        
        // Show admin gate if needed
        this.setupAdminGate();
    }
    
    initComponents() {
        this.components.header = new HeaderComponent();
        this.components.modal = new ModalComponent();
        this.components.toast = new ToastComponent();
        this.components.qrcode = new QRCodeComponent();
    }
    
    initViews() {
        this.views.menu = new MenuView();
        this.views.catering = new CateringView();
        this.views.admin = new AdminView();
    }
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }
    
    switchTab(tabName) {
        // Update UI
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.getElementById(`tab-${tabName}`).classList.add('active');
        document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
        
        this.currentTab = tabName;
        
        // Notify views
        if (tabName === 'admin' && this.views.admin) {
            this.views.admin.onShow();
        }
    }
    
    async loadInitialData() {
        await window.menuService.loadMenu();
    }
    
    loadSettings() {
        const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        const settings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
        window.appSettings = settings;
    }
    
    checkUrlHighlight() {
        const params = new URLSearchParams(window.location.search);
        const dishId = parseInt(params.get('dish'));
        
        if (dishId) {
            setTimeout(() => this.highlightDish(dishId), 600);
        }
    }
    
    highlightDish(dishId) {
        const dishCard = document.querySelector(`.dc[data-dish-id="${dishId}"]`);
        if (dishCard) {
            dishCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            dishCard.classList.add('dish-highlight');
            setTimeout(() => {
                dishCard.classList.remove('dish-highlight');
            }, 2000);
        }
    }
    
    setupAdminGate() {
        const isAdmin = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === '1';
        if (!isAdmin && this.currentTab === 'admin') {
            this.showAdminGate();
        }
    }
    
    showAdminGate() {
        if (this.components.modal) {
            this.components.modal.show({
                title: 'Admin Access',
                content: `
                    <input type="password" id="admin-password" class="fi" placeholder="Enter admin password">
                    <button id="admin-submit" class="btn-wa">Verify Access</button>
                `,
                onShow: () => {
                    document.getElementById('admin-submit').addEventListener('click', () => {
                        const password = document.getElementById('admin-password').value;
                        if (password === ADMIN_PASSWORD) {
                            sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, '1');
                            this.components.modal.hide();
                            location.reload();
                        } else {
                            window.toast.show('Invalid password', 'error');
                        }
                    });
                }
            });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});