// Agenda page tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all day tabs and day schedules
    const dayTabs = document.querySelectorAll('.day-tab');
    const daySchedules = document.querySelectorAll('.day-schedule');
    
    // Add click event listener to each tab
    dayTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get the day from data attribute
            const selectedDay = this.getAttribute('data-day');
            
            // Remove active class from all tabs
            dayTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all day schedules
            daySchedules.forEach(schedule => {
                schedule.classList.remove('active-day');
                schedule.style.display = 'none';
            });
            
            // Show the selected day schedule
            const selectedSchedule = document.getElementById(selectedDay);
            if (selectedSchedule) {
                selectedSchedule.classList.add('active-day');
                selectedSchedule.style.display = 'block';
                
                // Scroll to the schedule section smoothly
                selectedSchedule.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Initialize - show Day 1 by default
    const activeTab = document.querySelector('.day-tab.active');
    if (activeTab) {
        const activeDay = activeTab.getAttribute('data-day');
        daySchedules.forEach(schedule => {
            if (schedule.id === activeDay) {
                schedule.style.display = 'block';
                schedule.classList.add('active-day');
            } else {
                schedule.style.display = 'none';
                schedule.classList.remove('active-day');
            }
        });
    }
});