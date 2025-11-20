// Agenda page tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all day tabs and day schedules
    const dayTabs = document.querySelectorAll('.day-tab');
    const daySchedules = document.querySelectorAll('.day-schedule');
    
    // Function to show all days (for Full Agenda view)
    function showAllDays() {
        // Remove active class from all tabs
        dayTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to the "all" tab if it exists
        dayTabs.forEach(tab => {
            if (tab.getAttribute('data-day') === 'all') {
                tab.classList.add('active');
            }
        });
        
        // Show all day schedules
        daySchedules.forEach(schedule => {
            schedule.classList.add('active-day');
            schedule.style.display = 'block';
        });
        
        // Keep the tabs visible but show "all" as active
        const tabContainer = document.querySelector('.day-tabs');
        if (tabContainer) {
            tabContainer.style.display = 'flex';
        }
    }
    
    // Function to activate a specific day (make it globally accessible)
    function activateDay(dayId) {
        // Show the tabs container
        const tabContainer = document.querySelector('.day-tabs');
        if (tabContainer) {
            tabContainer.style.display = 'flex';
        }
        
        // Remove active class from all tabs
        dayTabs.forEach(t => t.classList.remove('active'));
        
        // Find and activate the corresponding tab
        dayTabs.forEach(tab => {
            if (tab.getAttribute('data-day') === dayId) {
                tab.classList.add('active');
            }
        });
        
        // Hide all day schedules
        daySchedules.forEach(schedule => {
            schedule.classList.remove('active-day');
            schedule.style.display = 'none';
        });
        
        // Show the selected day schedule
        const selectedSchedule = document.getElementById(dayId);
        if (selectedSchedule) {
            selectedSchedule.classList.add('active-day');
            selectedSchedule.style.display = 'block';
            
            // Scroll to the schedule section with a small delay for better UX
            setTimeout(() => {
                selectedSchedule.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    // Add click event listener to each tab
    dayTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const selectedDay = this.getAttribute('data-day');
            
            if (selectedDay === 'all') {
                showAllDays();
                // Update URL hash to reflect full agenda view
                history.replaceState(null, null, '#');
            } else {
                activateDay(selectedDay);
                // Update URL hash without triggering scroll
                history.replaceState(null, null, '#' + selectedDay);
            }
        });
    });
    
    // Check for URL hash on page load
    function checkUrlHash() {
        const hash = window.location.hash;
        if (hash === '#day2') {
            activateDay('day2');
        } else if (hash === '#day1') {
            activateDay('day1');
        } else if (hash === '#full' || hash === '') {
            // Show full agenda when no hash or #full
            showAllDays();
        } else {
            // Default to showing full agenda
            showAllDays();
        }
    }
    
    // Initialize based on URL hash
    checkUrlHash();
    
    // Handle hash changes (e.g., when user clicks back/forward)
    window.addEventListener('hashchange', checkUrlHash);
    
    // Make functions globally accessible for dropdown navigation
    window.activateDay = activateDay;
    window.showAllDays = showAllDays;
});