// =============================================================================
// DCF FAQ REUSABLE COMPONENTS
// =============================================================================

console.log('📚 DCF FAQ Components loading...');

// =============================================================================
// GET INVOLVED SECTION - STANDARDIZED ACROSS ALL FAQS
// =============================================================================

const FAQ_GET_INVOLVED = {
    // Topic-specific intro paragraphs (optional customization)
    intros: {
        'ai-jobs': 'The Domus Communis Foundation Hungary is working to ensure AI and automation serve workers\' dignity and the common good.',
        'ai-consciousness': 'The Domus Communis Foundation Hungary bridges faith and technology, exploring profound questions about AI, consciousness, and human dignity.',
        'ai-healthcare': 'The Domus Communis Foundation Hungary advocates for healthcare AI that respects human dignity and serves the vulnerable.',
        'default': 'The Domus Communis Foundation Hungary works to ensure artificial intelligence and emerging technologies serve human dignity, Catholic Social Teaching, and the common good.'
    },
    
    // Standard CTAs (consistent across all FAQs)
    ctas: [
        {
            icon: '💝',
            text: 'Support our mission',
            description: 'Your donation funds research, education, and advocacy for ethical AI',
            link: '/members/dcf_donate.html',
            linkText: 'Donate Now'
        },
        {
            icon: '🤝',
            text: 'Join our community',
            description: 'Connect with Catholic professionals, scholars, and leaders addressing AI ethics',
            link: '/auth/dcf_profile_signup.html',
            linkText: 'Become a Member'
        },
        {
            icon: '📬',
            text: 'Stay informed',
            description: 'Subscribe to our newsletter for insights on AI, technology, and Catholic teaching',
            link: '#newsletter-signup',
            linkText: 'Subscribe'
        },
        {
            icon: '🎯',
            text: 'Share your expertise',
            description: 'Contribute to our research initiatives and policy recommendations',
            link: '/public/dcf_contact.html',
            linkText: 'Get in Touch'
        }
    ],
    
    // Footer links
    footerLinks: [
        { text: 'Contact Us', url: '/public/dcf_contact.html' },
        { text: 'Support Our Work', url: '/members/dcf_donate.html' },
        { text: 'Explore Our Programs', url: '/initiatives/initiatives_home.html' }
    ],
    
    // Closing statement
    closingStatement: 'This resource is part of DCF Hungary\'s commitment to helping people understand and navigate the ethical challenges of artificial intelligence through the lens of Catholic Social Teaching and human dignity.'
};

// =============================================================================
// RENDER GET INVOLVED SECTION
// =============================================================================

function renderGetInvolvedSection(topic = 'default') {
    const basePath = window.getCorrectBasePath ? window.getCorrectBasePath() : '../';
    const intro = FAQ_GET_INVOLVED.intros[topic] || FAQ_GET_INVOLVED.intros.default;
    
    let html = `
        <div class="get-involved-section">
            <h2>Get Involved with DCF Hungary</h2>
            <p class="get-involved-intro">${intro}</p>
            
            <h3>How You Can Make a Difference:</h3>
            <div class="get-involved-grid">
    `;
    
    // Add CTAs
    FAQ_GET_INVOLVED.ctas.forEach(cta => {
        html += `
            <div class="get-involved-card">
                <div class="get-involved-icon">${cta.icon}</div>
                <h4>${cta.text}</h4>
                <p>${cta.description}</p>
                <a href="${basePath}${cta.link}" class="get-involved-link">${cta.linkText} →</a>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div class="get-involved-footer-links">
    `;
    
    // Add footer links
    FAQ_GET_INVOLVED.footerLinks.forEach((link, index) => {
        html += `<a href="${basePath}${link.url}">${link.text}</a>`;
        if (index < FAQ_GET_INVOLVED.footerLinks.length - 1) {
            html += ' | ';
        }
    });
    
    html += `
            </div>
            
            <p class="get-involved-closing"><em>${FAQ_GET_INVOLVED.closingStatement}</em></p>
        </div>
    `;
    
    return html;
}

// =============================================================================
// INJECT GET INVOLVED SECTION
// =============================================================================

function injectGetInvolvedSection(topic = 'default') {
    // Find the target container (usually at end of main content)
    const targetContainer = document.querySelector('.faq-content') || 
                           document.querySelector('.main-content') ||
                           document.querySelector('main');
    
    if (!targetContainer) {
        console.log('⚠️ No container found for Get Involved section');
        return;
    }
    
    const html = renderGetInvolvedSection(topic);
    
    // Insert before the last element (usually footer) or append
    targetContainer.insertAdjacentHTML('beforeend', html);
    
    console.log('✅ Get Involved section injected');
}

// =============================================================================
// ADD STYLES FOR GET INVOLVED SECTION
// =============================================================================

function addGetInvolvedStyles() {
    if (document.querySelector('#faq-get-involved-styles')) return;
    
    const styles = `
        <style id="faq-get-involved-styles">
            .get-involved-section {
                margin: 4rem 0 3rem 0;
                padding: 3rem 2rem;
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                border-radius: 16px;
                border: 2px solid #e5e5e5;
            }
            
            .get-involved-section h2 {
                font-size: 2rem;
                font-weight: 700;
                color: #000;
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .get-involved-intro {
                font-size: 1.1rem;
                color: #333;
                text-align: center;
                max-width: 800px;
                margin: 0 auto 2rem auto;
                line-height: 1.6;
            }
            
            .get-involved-section h3 {
                font-size: 1.3rem;
                font-weight: 600;
                color: #333;
                margin: 2rem 0 1.5rem 0;
                text-align: center;
            }
            
            .get-involved-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
                margin: 2rem 0;
            }
            
            .get-involved-card {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                border: 1px solid #e5e5e5;
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .get-involved-card:hover {
                border-color: #000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
            }
            
            .get-involved-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            
            .get-involved-card h4 {
                font-size: 1.2rem;
                font-weight: 600;
                color: #000;
                margin-bottom: 0.75rem;
            }
            
            .get-involved-card p {
                color: #666;
                line-height: 1.5;
                margin-bottom: 1.25rem;
            }
            
            .get-involved-link {
                display: inline-block;
                padding: 0.75rem 1.5rem;
                background: #000;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .get-involved-link:hover {
                background: #333;
                transform: translateX(2px);
            }
            
            .get-involved-footer-links {
                text-align: center;
                margin: 2rem 0 1.5rem 0;
                padding-top: 2rem;
                border-top: 1px solid #e5e5e5;
            }
            
            .get-involved-footer-links a {
                color: #333;
                text-decoration: none;
                font-weight: 600;
                padding: 0 1rem;
                transition: color 0.3s ease;
            }
            
            .get-involved-footer-links a:hover {
                color: #000;
                text-decoration: underline;
            }
            
            .get-involved-closing {
                text-align: center;
                color: #666;
                font-size: 0.95rem;
                line-height: 1.6;
                margin-top: 1.5rem;
            }
            
            @media (max-width: 768px) {
                .get-involved-section {
                    padding: 2rem 1.5rem;
                    margin: 3rem 0 2rem 0;
                }
                
                .get-involved-section h2 {
                    font-size: 1.5rem;
                }
                
                .get-involved-grid {
                    grid-template-columns: 1fr;
                }
                
                .get-involved-footer-links a {
                    display: block;
                    padding: 0.5rem 0;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
    console.log('✅ Get Involved styles added');
}

// =============================================================================
// AUTO-INITIALIZE
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Only run on FAQ pages
    if (window.location.pathname.includes('/faqs/')) {
        addGetInvolvedStyles();
        
        // Try to detect topic from URL
        const urlParts = window.location.pathname.split('/');
        const filename = urlParts[urlParts.length - 1].replace('.html', '');
        
        // Auto-inject if there's a .faq-content container
        if (document.querySelector('.faq-content')) {
            injectGetInvolvedSection(filename);
        }
    }
});

// Export for manual use
window.renderGetInvolvedSection = renderGetInvolvedSection;
window.injectGetInvolvedSection = injectGetInvolvedSection;

console.log('✅ DCF FAQ Components loaded');
