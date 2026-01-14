import React, { useState, useEffect } from 'react';
import {
    Search,
    Grid,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    User,
    CreditCard,
    MoreVertical,
    Home,
    Settings,
    LogOut,
    Package
} from 'lucide-react';
import './POS.css';
import { useNavigate } from 'react-router-dom';

const POS = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Dummy Categories
    const categories = ['All', 'Electronics', 'Furniture', 'Clothing', 'Services', 'Accessories'];

    // Dummy Products
    const products = [
        { id: 1, name: 'Wireless Headphones', price: 120.00, category: 'Electronics', stock: 15, image: null },
        { id: 2, name: 'Office Chair Ergonomic', price: 250.00, category: 'Furniture', stock: 5, image: null },
        { id: 3, name: 'Mechanical Keyboard', price: 89.99, category: 'Electronics', stock: 12, image: null },
        { id: 4, name: 'Cotton T-Shirt', price: 25.00, category: 'Clothing', stock: 50, image: null },
        { id: 5, name: 'USB-C Hub', price: 45.00, category: 'Accessories', stock: 20, image: null },
        { id: 6, name: 'Web Dev Service', price: 500.00, category: 'Services', stock: 999, image: null },
        { id: 7, name: 'Monitor 27"', price: 320.00, category: 'Electronics', stock: 8, image: null },
        { id: 8, name: 'Desk Lamp', price: 35.00, category: 'Furniture', stock: 15, image: null },
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Cart Logic
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prevCart, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQty = (id, change) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === id) {
                    const newQty = item.qty + change;
                    if (newQty < 1) return item; // Don't reduce below 1 here, use specific remove
                    return { ...item, qty: newQty };
                }
                return item;
            });
        });
    };

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.10; // 10% tax example
    const total = subtotal + tax;

    return (
        <div className="pos-layout">
            {/* Main Content: Product Grid */}
            <div className="pos-main-content">
                <div className="pos-header">
                    <div className="pos-search-bar">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="pos-search-input"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600" onClick={() => navigate('/company/dashboard')}>
                            <Home size={20} />
                        </button>
                    </div>
                </div>

                <div className="pos-categories">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="pos-products-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
                            <div className="stock-badge">{product.stock} in stock</div>
                            <div className="product-image-placeholder">
                                <Package size={40} strokeWidth={1.5} />
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p>{product.category}</p>
                                <div className="product-price">${product.price.toFixed(2)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar: Cart */}
            <div className="pos-sidebar">
                <div className="cart-header">
                    <h2>Current Sale</h2>
                    <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Clear Cart" onClick={() => setCart([])}>
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="customer-selector">
                    <button className="customer-select-btn" onClick={() => setSelectedCustomer('Walk-in Customer')}>
                        <span className="flex items-center gap-2">
                            <User size={18} className="text-blue-500" />
                            {selectedCustomer || 'Select Customer'}
                        </span>
                        <Grid size={16} />
                    </button>
                </div>

                <div className="cart-items-container">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingCart size={48} />
                            <p>Cart is empty</p>
                            <span className="text-sm text-gray-400">Click products to add here</span>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="cart-item">
                                {/* <div className="cart-item-img"></div> */}
                                <div className="cart-item-details">
                                    <span className="cart-item-title">{item.name}</span>
                                    <span className="cart-item-sku">SKU: {item.id}</span>
                                </div>
                                <div className="qty-controls">
                                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1}><Minus size={14} /></button>
                                    <span className="qty-display">{item.qty}</span>
                                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                                </div>
                                <div className="cart-item-price">
                                    ${(item.price * item.qty).toFixed(2)}
                                </div>
                                <button className="ml-3 text-gray-400 hover:text-red-500" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total Payable</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <button className="checkout-btn" disabled={cart.length === 0}>
                        <span>Pay Now</span>
                        <div className="flex items-center gap-2">
                            <span>${total.toFixed(2)}</span>
                            <CreditCard size={20} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;
