// Agenda page tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all day tabs and day schedules
    const dayTabs = document.querySelectorAll('.day-tab');
    const daySchedules = document.querySelectorAll('.day-schedule');
    
    // Function to activate a specific day
    function activateDay(dayId) {
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
            activateDay(selectedDay);
            
            // Update URL hash without triggering scroll
            history.replaceState(null, null, '#' + selectedDay);
        });
    });
    
    // Check for URL hash on page load
    function checkUrlHash() {
        const hash = window.location.hash;
        if (hash === '#day2') {
            activateDay('day2');
        } else if (hash === '#day1') {
            activateDay('day1');
        } else {
            // Default to Day 1 if no hash
            activateDay('day1');
        }
    }
    
    // Initialize based on URL hash
    checkUrlHash();
    
    // Handle hash changes (e.g., when user clicks back/forward)
    window.addEventListener('hashchange', checkUrlHash);
    
    // Ensure at least one day is visible on load
    // This is a failsafe in case styles aren't applied correctly
    const visibleDays = document.querySelectorAll('.day-schedule.active-day');
    if (visibleDays.length === 0) {
        // No active day, activate day 1 as default
        const day1 = document.getElementById('day1');
        if (day1) {
            day1.classList.add('active-day');
            day1.style.display = 'block';
        }
    }
});