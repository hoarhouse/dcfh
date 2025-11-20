// Registration Form Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - initializing components...');
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('Lucide icons initialized');
    }
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Check if registration form exists (for index.html)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistrationSubmit);
        console.log('Registration form initialized');
    }
    
    // Check if contact form exists (for contact.html)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        console.log('Contact form initialized');
    }
    
    // Initialize countdown timer
    console.log('Initializing countdown timer...');
    initCountdown();
});

// Mobile Navigation and Dropdown Functionality
function initMobileNavigation() {
    const hamburger = document.querySelector('.nav-hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const dropdownToggles = document.querySelectorAll('.nav-menu .has-dropdown > a');
    
    if (!hamburger || !navMenu) {
        console.log('Mobile navigation elements not found');
        return;
    }
    
    console.log('Initializing mobile navigation and dropdowns...');
    
    // Initialize dropdown functionality
    initDropdowns();
    
    // Toggle menu function
    function toggleMenu() {
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        if (navOverlay) {
            navOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
    
    // Event listeners
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Small delay to allow navigation to complete
            setTimeout(closeMenu, 150);
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on window resize (if desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && hamburger.classList.contains('active')) {
            closeMenu();
        }
    });
    
    console.log('Mobile navigation initialized successfully');
}

// Dropdown Menu Functionality
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    
    dropdownToggles.forEach(toggle => {
        // Prevent default link behavior for dropdown toggles
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            const parentLi = toggle.parentElement;
            const isMobile = window.innerWidth <= 1024;
            
            if (isMobile) {
                // Toggle active class for mobile dropdowns
                parentLi.classList.toggle('active');
                
                // Close other dropdowns
                document.querySelectorAll('.has-dropdown').forEach(item => {
                    if (item !== parentLi) {
                        item.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-dropdown')) {
            document.querySelectorAll('.has-dropdown').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
    
    // Handle dropdown menu item clicks for Day 1 and Day 2 on agenda page
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Check if we're on agenda.html and clicking a day link
            if (window.location.pathname.includes('agenda.html') && (href === '#day1' || href === '#day2')) {
                e.preventDefault();
                const dayId = href.substring(1); // Remove the #
                
                // Trigger the day change if the activateDay function exists
                if (typeof window.activateDay === 'function') {
                    window.activateDay(dayId);
                } else {
                    // Fallback: manually trigger the tab click
                    const targetTab = document.querySelector(`[data-day="${dayId}"]`);
                    if (targetTab) {
                        targetTab.click();
                    }
                }
                
                // Close the dropdown
                document.querySelectorAll('.has-dropdown').forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    });
    
    // Handle hover for desktop
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.has-dropdown').forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth > 1024) {
                    item.classList.add('active');
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (window.innerWidth > 1024) {
                    item.classList.remove('active');
                }
            });
        });
    }
}

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
}

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

// Professional Countdown Timer Object
const CountdownTimer = {
    targetDate: new Date('2026-03-02T09:00:00+01:00'),
    countdownElement: null,
    intervalId: null,
    
    init() {
        console.log('CountdownTimer.init() called');
        this.countdownElement = document.getElementById('countdown');
        if (!this.countdownElement) {
            console.error('Countdown element with ID "countdown" not found');
            return;
        }
        
        console.log('Countdown element found:', this.countdownElement);
        this.createCountdownStructure();
        this.startCountdown();
        console.log('Countdown timer initialized successfully');
    },
    
    createCountdownStructure() {
        console.log('Creating countdown structure...');
        const countdownHTML = `
            <div class="countdown-item">
                <span class="countdown-value" id="countdown-days">0</span>
                <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value" id="countdown-hours">0</span>
                <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value" id="countdown-minutes">0</span>
                <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value" id="countdown-seconds">0</span>
                <span class="countdown-label">Seconds</span>
            </div>
        `;
        
        this.countdownElement.innerHTML = countdownHTML;
        this.countdownElement.classList.add('countdown');
        console.log('Countdown HTML structure created and inserted');
    },
    
    startCountdown() {
        this.updateCountdown();
        
        this.intervalId = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    },
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;
        
        if (distance < 0) {
            this.handleCountdownExpired();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        this.updateDisplay(days, hours, minutes, seconds);
    },
    
    updateDisplay(days, hours, minutes, seconds) {
        const daysElement = document.getElementById('countdown-days');
        const hoursElement = document.getElementById('countdown-hours');
        const minutesElement = document.getElementById('countdown-minutes');
        const secondsElement = document.getElementById('countdown-seconds');
        
        if (daysElement) {
            daysElement.textContent = this.formatNumber(days);
            this.animateUpdate(daysElement);
        }
        
        if (hoursElement) {
            hoursElement.textContent = this.formatNumber(hours);
            if (hours === 0 && days === 0) {
                this.animateUpdate(hoursElement);
            }
        }
        
        if (minutesElement) {
            minutesElement.textContent = this.formatNumber(minutes);
            if (minutes === 0 && hours === 0 && days === 0) {
                this.animateUpdate(minutesElement);
            }
        }
        
        if (secondsElement) {
            const prevValue = secondsElement.textContent;
            secondsElement.textContent = this.formatNumber(seconds);
            if (prevValue !== secondsElement.textContent) {
                this.animateUpdate(secondsElement);
            }
        }
    },
    
    formatNumber(number) {
        return number < 10 ? '0' + number : number.toString();
    },
    
    animateUpdate(element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    },
    
    handleCountdownExpired() {
        clearInterval(this.intervalId);
        
        if (this.countdownElement) {
            this.countdownElement.innerHTML = `
                <div class="countdown-expired">
                    <h3>The Summit Has Begun!</h3>
                    <p>Join us at the Budapest Digital Peace Summit</p>
                </div>
            `;
            this.countdownElement.classList.add('countdown-expired-container');
        }
    },
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },
    
    restart() {
        this.stop();
        this.startCountdown();
    }
};

// Countdown Timer Function (updated to use new object)
function initCountdown() {
    CountdownTimer.init();
}

console.log('Budapest Digital Peace Summit 2026 - Site loaded');
console.log('Use viewRegistrations() in console to see all registrations');
console.log('Use viewContacts() in console to see all contact submissions');