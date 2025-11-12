(function() {
  'use strict';
  
  const CountdownTimer = {
    targetDate: new Date('2026-02-20T09:00:00+01:00'),
    countdownElement: null,
    intervalId: null,
    
    init() {
      this.countdownElement = document.getElementById('countdown');
      if (!this.countdownElement) {
        console.warn('Countdown element not found');
        return;
      }
      
      this.createCountdownStructure();
      this.startCountdown();
    },
    
    createCountdownStructure() {
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
            <p>Join us at the Cyberpeace Summit 2026</p>
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
    },
    
    getTimeRemaining() {
      const now = new Date().getTime();
      const distance = this.targetDate.getTime() - now;
      
      if (distance < 0) {
        return {
          total: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true
        };
      }
      
      return {
        total: distance,
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        expired: false
      };
    }
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CountdownTimer;
  } else {
    window.CountdownTimer = CountdownTimer;
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      CountdownTimer.init();
    });
  } else {
    CountdownTimer.init();
  }
})();