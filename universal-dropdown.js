// Universal Dropdown System - Fix Once, Works Everywhere
function toggleDropdown(button) {
    // Remove any existing dropdowns
    const existingDropdown = document.querySelector('.dropdown-menu.active');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    // Create new dropdown with WORKING links
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu active';
    dropdown.innerHTML = `
        <a href="dcf_member_profile.html" class="dropdown-item">View Profile</a>
        <a href="dcf_account_settings.html" class="dropdown-item">Account Settings</a>
        <a href="dcf_notifications_center.html" class="dropdown-item">Notifications</a>
        <div class="dropdown-item logout-item" onclick="event.stopPropagation(); localStorage.clear(); window.location.href='login.html';">LOGOUT</div>
    `;
    
    // Position and show dropdown
    button.style.position = 'relative';
    button.appendChild(dropdown);
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function closeDropdown(e) {
        if (!button.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Universal CSS injection
const universalCSS = `
.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 180px;
    display: none;
}

.dropdown-menu.active {
    display: block;
}

.dropdown-item {
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.9rem;
    color: #333 !important;
    text-decoration: none;
    display: block;
}

.dropdown-item:last-child {
    border-bottom: none;
}

.dropdown-item:hover {
    background: #f8f9fa;
}

.logout-item {
    border-top: 1px solid #e5e5e5;
    color: #dc3545 !important;
}
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = universalCSS;
document.head.appendChild(style);