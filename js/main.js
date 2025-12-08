// ===== Shopping Cart Functionality =====
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('greenerCart')) || [];
        this.updateCartCount();
        this.setupEventListeners();
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    addItem(packageName, price) {
        const existingItem = this.cart.find(item => item.name === packageName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name: packageName,
                price: price,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification(`Added ${packageName} to cart!`);
    }

    saveCart() {
        localStorage.setItem('greenerCart', JSON.stringify(this.cart));
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'alert alert-success position-fixed top-0 end-0 m-3';
        notification.style.zIndex = '9999';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const packageName = e.target.dataset.package;
                const price = parseInt(e.target.dataset.price);
                this.addItem(packageName, price);
            }
        });
    }
}

// ===== Initialize when DOM is loaded =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize shopping cart
    const cart = new ShoppingCart();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.input-group');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert(`Thank you for subscribing with: ${email}`);
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }

    // Hover effects for gallery cards
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Testimonial rotation (simple version)
    const testimonials = [
        {
            text: "Greener Weddings captured our castle wedding perfectly. The photos are magical and truly reflect the Irish spirit of our day!",
            author: "Sarah & Mark",
            location: "Kilkenny Castle Wedding"
        },
        {
            text: "The natural, candid style was exactly what we wanted. Our beach ceremony photos are stunning and full of emotion.",
            author: "Aoife & Conor",
            location: "Galway Beach Wedding"
        },
        {
            text: "Professional, creative, and so easy to work with. Our forest elopement photos are like something from a fairy tale.",
            author: "Emma & David",
            location: "Wicklow Forest Elopement"
        }
    ];

    let currentTestimonial = 0;
    const testimonialElement = document.querySelector('.testimonial');
    
    if (testimonialElement) {
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonialElement.innerHTML = `
                <div class="testimonial-image mb-4">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                         class="rounded-circle" alt="Couple">
                </div>
                <p class="testimonial-text lead mb-4">"${testimonials[currentTestimonial].text}"</p>
                <h5 class="testimonial-author">${testimonials[currentTestimonial].author}</h5>
                <p class="testimonial-location">${testimonials[currentTestimonial].location}</p>
            `;
        }, 5000); // Change every 5 seconds
    }
});

// ===== Additional CSS for navbar scroll =====
const style = document.createElement('style');
style.textContent = `
    .navbar-scrolled {
        box-shadow: 0 5px 20px rgba(0,0,0,0.1) !important;
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
    }
    
    .alert-success {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);