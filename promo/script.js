// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(45deg) translate(5px, 5px)' 
        : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(-45deg) translate(7px, -6px)' 
        : 'none';
});

// Close mobile menu when clicking on a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Billing Toggle (Monthly/Annual)
const billingToggle = document.getElementById('billingToggle');
const priceAmounts = document.querySelectorAll('.amount:not(.custom)');

billingToggle.addEventListener('change', () => {
    const isAnnual = billingToggle.checked;
    
    priceAmounts.forEach(amount => {
        const monthlyPrice = amount.dataset.monthly;
        const annualPrice = amount.dataset.annual;
        
        // Animate price change
        amount.style.transform = 'scale(0.8)';
        amount.style.opacity = '0.5';
        
        setTimeout(() => {
            amount.textContent = isAnnual ? annualPrice : monthlyPrice;
            amount.style.transform = 'scale(1)';
            amount.style.opacity = '1';
        }, 150);
    });
});

// Email Form Submission
const emailInput = document.getElementById('emailInput');
const submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        emailInput.focus();
        return;
    }
    
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        emailInput.focus();
        return;
    }
    
    // Simulate form submission
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you! Check your email to get started.', 'success');
        emailInput.value = '';
        submitBtn.textContent = 'Get Started Free';
        submitBtn.disabled = false;
    }, 1500);
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '600',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease-out',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    });
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth Scroll Enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.feature-card, .benefit-item, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Pricing Card Click Handlers
document.querySelectorAll('.pricing-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const planName = e.target.closest('.pricing-card').querySelector('.plan-name').textContent;
        
        if (btn.textContent === 'Contact Sales') {
            showNotification(`Opening contact form for ${planName} plan...`, 'info');
        } else {
            showNotification(`Starting free trial for ${planName} plan...`, 'success');
        }
    });
});

// Add keyboard accessibility
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        mobileMenuBtn.click();
    }
    
    // Submit email with Enter key
    if (e.key === 'Enter' && document.activeElement === emailInput) {
        submitBtn.click();
    }
});

// Log page load
console.log('Asset Compass Promo Page Loaded');
console.log('Version: 1.0.0');

