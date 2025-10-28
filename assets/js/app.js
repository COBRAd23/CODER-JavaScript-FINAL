// Importar datos desde data.js
import { coursesData as importedCoursesData, BUSINESS_CONFIG as importedBusinessConfig } from './data.js';

// Variables globales
let coursesData = [];
let BUSINESS_CONFIG = {};
let cart = [];

// Elementos del DOM
const productsContainer = document.getElementById('products-container');
const cartItems = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTax = document.getElementById('cart-tax');
const cartShipping = document.getElementById('cart-shipping');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const sortFilter = document.getElementById('sort-filter');

// Funciones de utilidad
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(price);
};

const showToast = (message, type = 'success') => {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            background: type === 'success' 
                ? "linear-gradient(to right, #00b09b, #96c93d)"
                : "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
    }).showToast();
};

const showLoadingState = () => {
    productsContainer.innerHTML = `
        <div class="loading-state">
            <div class="loader"></div>
            <p>Cargando productos...</p>
        </div>
    `;
};

const showErrorState = (error) => {
    productsContainer.innerHTML = `
        <div class="error-state">
            <p>❌ Error al cargar los productos</p>
            <p class="error-details">${error}</p>
            <button onclick="window.initializeApp()" class="btn-primary">
                Reintentar
            </button>
        </div>
    `;
};

// Carga de datos
const loadData = async () => {
    try {
        showLoadingState();
        // Usar los datos importados del módulo
        coursesData = importedCoursesData;
        BUSINESS_CONFIG = importedBusinessConfig;
        renderProducts();
    } catch (error) {
        console.error('Error loading data:', error);
        showErrorState(error.message);
    }
};

// Renderizado de productos
const renderProducts = (products = coursesData) => {
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.imageAlt || product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400/d1d5db/4b5563?text=Imagen+no+disponible';">
            </div>
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}</p>
            <p class="details">
                ${product.duration} | ${product.level}<br>
                ${product.description}
            </p>
            <button 
                onclick="window.addToCart(${product.id})" 
                class="btn-primary"
                ${cart.find(item => item.id === product.id && item.quantity >= product.stock) ? 'disabled' : ''}
            >
                Agregar al Carrito
            </button>
        </article>
    `).join('');
};

// Manejo del carrito
const updateCart = () => {
    if (!cartCount || !emptyCartMessage || !cartItems) return;
    
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Mostrar/ocultar mensaje de carrito vacío
    emptyCartMessage.style.display = cart.length === 0 ? 'block' : 'none';
    cartItems.style.display = cart.length === 0 ? 'none' : 'block';

    // Actualizar items del carrito
    if (cart.length > 0) {
        cartItems.innerHTML = cart.map(item => {
            const product = coursesData.find(p => p.id === item.id);
            if (!product) return '';
            return `
                <div class="cart-item">
                    <div class="item-details">
                        <h4>${product.name}</h4>
                        <p class="price">${formatPrice(product.price)}</p>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="window.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button 
                            onclick="window.updateQuantity(${item.id}, ${item.quantity + 1})"
                            ${item.quantity >= product.stock ? 'disabled' : ''}
                        >+</button>
                    </div>
                    <button onclick="window.removeFromCart(${item.id})">❌</button>
                </div>
            `;
        }).join('');
    }

    // Calcular y actualizar totales
    const subtotal = cart.reduce((sum, item) => {
        const product = coursesData.find(p => p.id === item.id);
        if (!product) return sum;
        return sum + (product.price * item.quantity);
    }, 0);

    const tax = subtotal * BUSINESS_CONFIG.TAX_RATE;
    const shipping = cart.length > 0 ? BUSINESS_CONFIG.SHIPPING_COST || 0 : 0;
    const total = subtotal + tax + shipping;

    if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
    if (cartTax) cartTax.textContent = formatPrice(tax);
    if (cartShipping) cartShipping.textContent = formatPrice(shipping);
    if (cartTotal) cartTotal.textContent = formatPrice(total);

    // Actualizar estado de botones
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
    if (clearCartBtn) clearCartBtn.disabled = cart.length === 0;

    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Funciones del carrito
const addToCart = (productId) => {
    const product = coursesData.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
            showToast(`Se agregó otra unidad de ${product.name}`, 'success');
        } else {
            showToast(`¡Stock máximo alcanzado para ${product.name}!`, 'error');
            return;
        }
    } else {
        cart.push({ id: productId, quantity: 1 });
        showToast(`¡${product.name} agregado al carrito!`, 'success');
    }

    updateCart();
};

const updateQuantity = (productId, newQuantity) => {
    const product = coursesData.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > product.stock) {
        showToast(`¡Stock máximo alcanzado para ${product.name}!`, 'error');
        return;
    }

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        updateCart();
    }
};

const removeFromCart = (productId) => {
    const product = coursesData.find(p => p.id === productId);
    cart = cart.filter(item => item.id !== productId);
    showToast(`${product.name} eliminado del carrito`, 'error');
    updateCart();
};

const clearCart = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminarán todos los items del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4361ee',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cart = [];
            updateCart();
            showToast('Carrito vaciado', 'error');
        }
    });
};

const checkout = () => {
    const subtotal = cart.reduce((sum, item) => {
        const product = coursesData.find(p => p.id === item.id);
        if (!product) return sum;
        return sum + (product.price * item.quantity);
    }, 0);
    const tax = subtotal * BUSINESS_CONFIG.TAX_RATE;
    const shipping = BUSINESS_CONFIG.SHIPPING_COST || 0;
    const total = subtotal + tax + shipping;

    Swal.fire({
        title: 'Finalizar Compra',
        html: `
            <div style="text-align: left; margin: 20px 0;">
                <p>Total a pagar: ${formatPrice(total)}</p>
            </div>
            <form id="checkout-form">
                <input type="text" id="name" class="swal2-input" placeholder="Nombre completo" required>
                <input type="email" id="email" class="swal2-input" placeholder="Email" required>
            </form>
        `,
        confirmButtonText: 'Pagar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
            const name = Swal.getPopup().querySelector('#name').value;
            const email = Swal.getPopup().querySelector('#email').value;
            
            if (!name || !email) {
                Swal.showValidationMessage('Por favor completa todos los campos');
                return false;
            }
            
            return { name, email };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Simular procesamiento
            Swal.fire({
                title: 'Procesando...',
                text: 'Estamos procesando tu compra',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Simular delay de procesamiento
            setTimeout(() => {
                cart = [];
                updateCart();
                toggleView('products');
                
                Swal.fire({
                    title: '¡Compra exitosa!',
                    html: `
                        <p>¡Gracias por tu compra, ${result.value.name}!</p>
                        <p>Enviaremos los detalles a: ${result.value.email}</p>
                    `,
                    icon: 'success'
                });
            }, 2000);
        }
    });
};

// Manejo de vistas
const toggleView = (view) => {
    const productsView = document.getElementById('products-view');
    const cartView = document.getElementById('cart-view');

    if (view === 'cart') {
        productsView.classList.remove('active');
        cartView.classList.add('active');
    } else {
        cartView.classList.remove('active');
        productsView.classList.add('active');
    }
};

// Event Listeners
if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
        const sortedProducts = [...coursesData];
        switch (e.target.value) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Mantener orden original
                break;
        }
        renderProducts(sortedProducts);
    });
}

// Eventos de navegación
const cartToggle = document.getElementById('cart-toggle');
const backToProducts = document.getElementById('back-to-products');
const startShopping = document.getElementById('start-shopping');

if (cartToggle) cartToggle.addEventListener('click', () => toggleView('cart'));
if (backToProducts) backToProducts.addEventListener('click', () => toggleView('products'));
if (startShopping) startShopping.addEventListener('click', () => toggleView('products'));

// Event listeners de botones
if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

// Exponer funciones al scope global
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.initializeApp = initializeApp;

// Inicialización
async function initializeApp() {
    try {
        // Cargar carrito desde localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        // Cargar datos y renderizar
        await loadData();
        updateCart();
    } catch (error) {
        console.error('Error initializing app:', error);
        showErrorState('Error al inicializar la aplicación');
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);