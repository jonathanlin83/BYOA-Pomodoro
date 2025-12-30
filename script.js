class PomodoroTimer {
    constructor() {
        this.modes = {
            work: { duration: 25 * 60, label: 'Work Session' },
            rest: { duration: 5 * 60, label: 'Rest Session' }
        };
        
        this.currentMode = 'work';
        this.timeLeft = this.modes[this.currentMode].duration;
        this.intervalId = null;
        this.isRunning = false;
        this.pomodorosCompleted = parseInt(localStorage.getItem('pomodoros') || '0');
        
        this.initializeElements();
        this.updateToggleButton();
        this.updateDisplay();
        this.attachEventListeners();
        this.loadPomodoros();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('time');
        this.modeLabel = document.getElementById('mode-label');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.pomodorosDisplay = document.getElementById('pomodoros');
        this.toggleBtn = document.getElementById('work-rest-toggle');
        this.toggleLabel = this.toggleBtn.querySelector('.toggle-label');
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.toggleBtn.addEventListener('click', () => {
            if (!this.isRunning) {
                this.toggleMode();
            }
        });
    }
    
    toggleMode() {
        // Switch between work and rest
        this.currentMode = this.currentMode === 'work' ? 'rest' : 'work';
        this.timeLeft = this.modes[this.currentMode].duration;
        this.updateToggleButton();
        this.updateDisplay();
    }
    
    setMode(mode) {
        this.currentMode = mode;
        this.timeLeft = this.modes[mode].duration;
        this.updateToggleButton();
        this.updateDisplay();
    }
    
    updateToggleButton() {
        this.toggleLabel.textContent = this.currentMode === 'work' ? 'Work' : 'Rest';
        this.toggleBtn.classList.toggle('work-mode', this.currentMode === 'work');
        this.toggleBtn.classList.toggle('rest-mode', this.currentMode === 'rest');
    }
    
    start() {
        if (this.timeLeft === 0) {
            this.reset();
            return;
        }
        
        this.isRunning = true;
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-block';
        
        this.intervalId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft === 0) {
                this.complete();
            }
        }, 1000);
    }
    
    pause() {
        this.isRunning = false;
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    reset() {
        this.pause();
        this.timeLeft = this.modes[this.currentMode].duration;
        this.updateDisplay();
    }
    
    complete() {
        this.pause();
        
        // Play notification sound (using Web Audio API)
        this.playNotification();
        
        // If work session completed, increment pomodoros
        if (this.currentMode === 'work') {
            this.pomodorosCompleted++;
            this.savePomodoros();
            this.loadPomodoros();
            
            // Auto-switch to rest after work
            this.setMode('rest');
        } else {
            // Auto-switch back to work after rest
            this.setMode('work');
        }
        
        // Show completion notification
        if (Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: this.currentMode === 'work' 
                    ? 'Time for a rest!' 
                    : 'Ready to get back to work?'
            });
        }
    }
    
    playNotification() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.modeLabel.textContent = this.modes[this.currentMode].label;
    }
    
    savePomodoros() {
        localStorage.setItem('pomodoros', this.pomodorosCompleted.toString());
        // Also save the date to reset daily
        const today = new Date().toDateString();
        localStorage.setItem('pomodorosDate', today);
    }
    
    loadPomodoros() {
        // Reset pomodoros if it's a new day
        const savedDate = localStorage.getItem('pomodorosDate');
        const today = new Date().toDateString();
        
        if (savedDate !== today) {
            this.pomodorosCompleted = 0;
            this.savePomodoros();
        } else {
            this.pomodorosCompleted = parseInt(localStorage.getItem('pomodoros') || '0');
        }
        
        this.pomodorosDisplay.textContent = this.pomodorosCompleted;
    }
}

// Request notification permission on page load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});

