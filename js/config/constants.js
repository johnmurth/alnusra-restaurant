// Menu Categories
export const CATEGORIES = [
    'Breakfast — In-House Bittings',
    'Breakfast — Egg Dishes',
    'Beans',
    'Salads',
    'Vegetable Salads',
    'Burgers & Sandwiches',
    'Chicken Corner',
    'Soups',
    'Main Dishes',
    'Side Dishes',
    'Fish Corner'
];

// Catering Pricing (per person in KSh)
export const CATERING_PRICES = {
    'Corporate Event': 850,
    'Wedding': 1200,
    'Nikkah': 1200,
    'Ruracio / Traditional': 950,
    'Chama / Table Banking': 700,
    'Birthday Party': 750,
    "Kids' Party": 600,
    'Graduation': 750,
    'Church / Religious Event': 700,
    'NGO / Community Event': 680,
    'Other': 800
};

// Guest Count Estimations
export const GUEST_ESTIMATES = {
    '20–50': 35,
    '50–100': 75,
    '100–200': 150,
    '200–350': 275,
    '350–500': 425,
    '500+': 600
};

// Admin Password
export const ADMIN_PASSWORD = 'admin@alnusra';

// Default Menu
export const DEFAULT_MENU = [
    {id: 1, name: 'Andazi', cat: 'Breakfast — In-House Bittings', price: 50, desc: 'Freshly fried East African doughnuts', img: ''},
    {id: 2, name: 'Mahamri', cat: 'Breakfast — In-House Bittings', price: 50, desc: 'Coconut-spiced fried bread', img: ''},
    {id: 3, name: 'Chapati', cat: 'Breakfast — In-House Bittings', price: 50, desc: 'Soft layered flatbread', img: ''},
    {id: 4, name: 'Beef Samosa', cat: 'Breakfast — In-House Bittings', price: 50, desc: 'Crispy pastry with spiced beef filling', img: ''},
    {id: 5, name: 'Plain Omelette', cat: 'Breakfast — Egg Dishes', price: 100, desc: 'Classic fluffy plain omelette', img: ''},
    {id: 6, name: 'Chicken Biriani', cat: 'Chicken Corner', price: 550, desc: 'Fragrant spiced rice with tender chicken', img: ''},
    {id: 7, name: 'Ugali', cat: 'Main Dishes', price: 70, desc: 'Classic maize ugali', img: ''},
    {id: 8, name: 'Grilled Fish Fillet', cat: 'Fish Corner', price: 500, desc: 'Fresh fish fillet off the grill', img: ''}
];

// Local Storage Keys
export const STORAGE_KEYS = {
    MENU: 'alnusra_menu',
    SETTINGS: 'alnusra_settings',
    FIREBASE_CONFIG: 'alnusra_firebase',
    ADMIN_AUTH: 'alnusra_admin'
};

// WhatsApp Settings
export const DEFAULT_SETTINGS = {
    wa: '254728832770',
    name: 'Al-Nusra Restaurant'
};