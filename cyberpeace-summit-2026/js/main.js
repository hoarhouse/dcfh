(function() {
  'use strict';
  
  const App = {
    init() {
      this.initMobileNavigation();
      this.initSmoothScrolling();
      this.initFormValidation();
      this.initExitIntentPopup();
      this.initCountdownTimer();
      this.initAnimations();
      this.initAccessibility();
    },
    
    initMobileNavigation() {
      const navToggle = document.querySelector('.navbar-toggle');
      const navMenu = document.querySelector('.navbar-nav');
      
      if (!navToggle || !navMenu) return;
      
      navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        navMenu.classList.toggle('active');
        
        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
        
        const spans = navToggle.querySelectorAll('span');
        if (isExpanded) {
          spans[0].style.transform = 'rotate(45deg) translateY(8px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
          spans[0].style.transform = '';
          spans[1].style.opacity = '';
          spans[2].style.transform = '';
        }
      });
      
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          
          const spans = navToggle.querySelectorAll('span');
          spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
          });
        }
      });
      
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          
          const spans = navToggle.querySelectorAll('span');
          spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
          });
        }
      });
    },
    
    initSmoothScrolling() {
      const links = document.querySelectorAll('a[href^="#"]');
      
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          
          if (href === '#' || href === '#0') return;
          
          const target = document.querySelector(href);
          
          if (target) {
            e.preventDefault();
            
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            const navMenu = document.querySelector('.navbar-nav');
            if (navMenu && navMenu.classList.contains('active')) {
              navMenu.classList.remove('active');
              
              const navToggle = document.querySelector('.navbar-toggle');
              if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                  span.style.transform = '';
                  span.style.opacity = '';
                });
              }
            }
            
            if (target.id) {
              history.pushState(null, '', '#' + target.id);
            }
          }
        });
      });
    },
    
    initFormValidation() {
      const forms = document.querySelectorAll('form:not([novalidate])');
      
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          if (!this.validateForm(form)) {
            e.stopPropagation();
            return false;
          }
          
          this.handleFormSubmit(form);
        });
        
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          input.addEventListener('blur', () => {
            this.validateField(input);
          });
          
          input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
              this.validateField(input);
            }
          });
        });
      });
    },
    
    validateForm(form) {
      const fields = form.querySelectorAll('[required], [type="email"]');
      let isValid = true;
      
      fields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
      
      return isValid;
    },
    
    validateField(field) {
      const value = field.value.trim();
      let isValid = true;
      let errorMessage = '';
      
      field.classList.remove('is-invalid');
      
      if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
      } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
      } else if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
      } else if (field.minLength && value.length < field.minLength) {
        isValid = false;
        errorMessage = `Minimum ${field.minLength} characters required`;
      } else if (field.pattern && value) {
        const pattern = new RegExp(field.pattern);
        if (!pattern.test(value)) {
          isValid = false;
          errorMessage = field.title || 'Please match the requested format';
        }
      }
      
      if (!isValid) {
        field.classList.add('is-invalid');
        
        let feedback = field.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
          feedback = document.createElement('div');
          feedback.className = 'invalid-feedback';
          field.parentNode.insertBefore(feedback, field.nextSibling);
        }
        feedback.textContent = errorMessage;
      } else {
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.remove();
        }
      }
      
      return isValid;
    },
    
    handleFormSubmit(form) {
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';
      
      if (submitBtn) {
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
      }
      
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      console.log('Form submitted with data:', data);
      
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = 'Success!';
          submitBtn.classList.add('btn-success');
        }
        
        setTimeout(() => {
          form.reset();
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-success');
          }
          
          this.showNotification('Form submitted successfully!', 'success');
        }, 1500);
      }, 1000);
    },
    
    initExitIntentPopup() {
      let popupShown = false;
      let popupClosed = false;
      const popupDelay = 5000;
      const popupCooldown = 86400000;
      
      const lastPopupTime = localStorage.getItem('exitPopupLastShown');
      if (lastPopupTime && Date.now() - parseInt(lastPopupTime) < popupCooldown) {
        return;
      }
      
      setTimeout(() => {
        document.addEventListener('mouseout', (e) => {
          if (popupShown || popupClosed) return;
          
          if (!e.toElement && !e.relatedTarget) {
            this.showExitPopup();
            popupShown = true;
          }
        });
        
        document.addEventListener('mouseleave', (e) => {
          if (popupShown || popupClosed) return;
          
          if (e.clientY <= 0) {
            this.showExitPopup();
            popupShown = true;
          }
        });
      }, popupDelay);
    },
    
    showExitPopup() {
      const existingPopup = document.querySelector('.popup-overlay');
      if (existingPopup) {
        existingPopup.remove();
      }
      
      const popupHTML = `
        <div class="popup-overlay" id="exitPopup">
          <div class="popup-content">
            <button class="popup-close" aria-label="Close popup">&times;</button>
            <h2>Wait! Don't Miss Out</h2>
            <p>Join the Cyberpeace Summit 2026 and be part of the global conversation on cyber security and digital peace.</p>
            <div class="form-group">
              <label for="popup-email" class="form-label">Get Early Bird Access</label>
              <input type="email" id="popup-email" class="form-control" placeholder="Enter your email" required>
            </div>
            <button class="btn btn-primary btn-lg" style="width: 100%;">Secure Your Spot</button>
            <p style="font-size: 0.875rem; color: #6c757d; margin-top: 1rem; margin-bottom: 0;">
              Limited early bird tickets available. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', popupHTML);
      
      const popup = document.getElementById('exitPopup');
      const closeBtn = popup.querySelector('.popup-close');
      const submitBtn = popup.querySelector('.btn-primary');
      const emailInput = popup.querySelector('#popup-email');
      
      setTimeout(() => {
        popup.classList.add('active');
      }, 10);
      
      const closePopup = () => {
        popup.classList.remove('active');
        setTimeout(() => {
          popup.remove();
        }, 300);
        localStorage.setItem('exitPopupLastShown', Date.now().toString());
      };
      
      closeBtn.addEventListener('click', closePopup);
      
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          closePopup();
        }
      });
      
      submitBtn.addEventListener('click', () => {
        if (emailInput.value && this.validateField(emailInput)) {
          submitBtn.textContent = 'Success!';
          submitBtn.disabled = true;
          
          setTimeout(() => {
            closePopup();
            this.showNotification('Thank you for your interest! Check your email for early bird access.', 'success');
          }, 1000);
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
          closePopup();
        }
      });
    },
    
    initCountdownTimer() {
      if (typeof CountdownTimer !== 'undefined') {
        console.log('Countdown timer initialized via countdown.js');
      } else {
        console.warn('CountdownTimer not found. Make sure countdown.js is loaded.');
      }
    },
    
    initAnimations() {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      const animatedElements = document.querySelectorAll('.card, .section-title, .hero-content');
      animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    },
    
    initAccessibility() {
      const navbar = document.querySelector('.navbar');
      if (navbar && !navbar.querySelector('.skip-to-content')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to main content';
        navbar.prepend(skipLink);
      }
      
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach(img => {
        img.setAttribute('alt', '');
      });
      
      const buttons = document.querySelectorAll('button:not([aria-label])');
      buttons.forEach(button => {
        if (!button.textContent.trim()) {
          button.setAttribute('aria-label', 'Button');
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-nav');
        }
      });
      
      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
      });
    },
    
    showNotification(message, type = 'info') {
      const existingNotification = document.querySelector('.notification-toast');
      if (existingNotification) {
        existingNotification.remove();
      }
      
      const notification = document.createElement('div');
      notification.className = `notification-toast alert alert-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 3000;
        min-width: 250px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);
    },
    
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    throttle(func, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  };
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
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
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .keyboard-nav *:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      App.init();
    });
  } else {
    App.init();
  }
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
  } else {
    window.CyberpeaceApp = App;
  }
})();