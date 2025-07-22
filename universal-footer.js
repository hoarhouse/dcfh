/ Universal Footer - Edit Once, Updates Everywhere
document.addEventListener('DOMContentLoaded', function() {
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <div class="footer-logo-icon"></div>
                        <span class="footer-logo-text">DCF Hungary</span>
                    </div>
                </div>
                <div class="footer-section">
                    <h4 class="footer-title">Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="#mission">About Us</a></li>
                        <li><a href="dcf_contact.html">Contact</a></li>
                        <li><a href="dcf_login_page.html">Member Login</a></li>
                        <li><a href="dcf_profile_signup.html">Join Us</a></li>
                        <li><a href="dcf_sitemap.html">Site Map</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>

    <style>
    .site-footer { background: 
#1a1a1a; color: 
#ffffff; padding: 2rem 0; margin-top: 2rem; }
    .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    .footer-content { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .footer-logo { display: flex; align-items: center; }
    .footer-logo-icon { width: 32px; height: 32px; background: 
#ffffff; border-radius: 50%; margin-right: 0.75rem; }
    .footer-logo-text { font-size: 1.4rem; font-weight: 700; }
    .footer-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }
    .footer-links { list-style: none; padding: 0; }
    .footer-links li { margin-bottom: 0.5rem; }
    .footer-links a { color: 
#cccccc; text-decoration: none; }
    .footer-links a:hover { color: 
#ffffff; }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
});