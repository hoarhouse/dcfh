// Form Submission Handler
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const organization = document.getElementById('organization').value;
    const interest = document.getElementById('interest').value;
    
    // Basic validation
    if (!firstName || !lastName || !email) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Store in localStorage for now (will be replaced with database later)
    const registration = {
        firstName,
        lastName,
        email,
        organization,
        interest,
        timestamp: new Date().toISOString()
    };
    
    // Get existing registrations
    let registrations = JSON.parse(localStorage.getItem('summitRegistrations') || '[]');
    
    // Check for duplicate email
    if (registrations.some(reg => reg.email === email)) {
        showMessage('This email is already registered', 'error');
        return;
    }
    
    // Add new registration
    registrations.push(registration);
    localStorage.setItem('summitRegistrations', JSON.stringify(registrations));
    
    // Show success message
    showMessage('Thank you for your interest! We\'ll keep you updated on the summit.', 'success');
    
    // Reset form
    document.getElementById('registerForm').reset();
    
    // Log for admin purposes (temporary)
    console.log('New registration:', registration);
});

// Message display function
function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navigation
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Animation on scroll (simple fade-in effect)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Log registered users (temporary admin function)
window.viewRegistrations = function() {
    const registrations = JSON.parse(localStorage.getItem('summitRegistrations') || '[]');
    console.log('Total Registrations:', registrations.length);
    console.table(registrations);
    return registrations;
};

console.log('Budapest Digital Peace Summit 2026 - Site loaded');
console.log('Use viewRegistrations() in console to see all registrations');