// Registration Form Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if registration form exists (for index.html)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistrationSubmit);
    }
    
    // Check if contact form exists (for contact.html)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Initialize countdown timer
    initCountdown();
});

// Registration Form Handler
function handleRegistrationSubmit(e) {
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

// Contact Form Handler
function handleContactSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const organization = document.getElementById('contactOrganization').value;
    const inquiryType = document.getElementById('contactInquiryType').value;
    const message = document.getElementById('contactMessage').value;
    
    // Basic validation
    if (!name || !email || !inquiryType || !message) {
        showContactMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showContactMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Store in localStorage for now (will be replaced with database later)
    const contact = {
        name,
        email,
        organization,
        inquiryType,
        message,
        timestamp: new Date().toISOString()
    };
    
    // Get existing contacts
    let contacts = JSON.parse(localStorage.getItem('summitContacts') || '[]');
    
    // Add new contact
    contacts.push(contact);
    localStorage.setItem('summitContacts', JSON.stringify(contacts));
    
    // Show success message
    showContactMessage('Thank you for your message! We\'ll get back to you within 24-48 hours.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Log for admin purposes (temporary)
    console.log('New contact submission:', contact);
}

// Message display function
function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Contact form message display function
function showContactMessage(message, type) {
    const messageDiv = document.getElementById('contactFormMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
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

// Log contact submissions (temporary admin function)
window.viewContacts = function() {
    const contacts = JSON.parse(localStorage.getItem('summitContacts') || '[]');
    console.log('Total Contact Submissions:', contacts.length);
    console.table(contacts);
    return contacts;
};

// Countdown Timer Function
function initCountdown() {
    // Check if countdown elements exist (only on index.html)
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) {
        return;
    }
    
    // Target date: March 2, 2026, 9:00 AM Budapest time (CET/CEST)
    // Budapest is GMT+1 (CET) in winter, GMT+2 (CEST) in summer
    // March 2, 2026 will be in CET (GMT+1)
    const targetDate = new Date('2026-03-02T09:00:00+01:00').getTime();
    
    // Get DOM elements
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        // If countdown is finished
        if (distance < 0) {
            daysElement.textContent = '000';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM with proper formatting
        daysElement.textContent = days.toString().padStart(3, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

console.log('Budapest Digital Peace Summit 2026 - Site loaded');
console.log('Use viewRegistrations() in console to see all registrations');
console.log('Use viewContacts() in console to see all contact submissions');