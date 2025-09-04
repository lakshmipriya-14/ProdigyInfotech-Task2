class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.laps = [];
        
        this.display = document.getElementById('display');
        this.startBtn = document.getElementById('startBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapsList = document.getElementById('lapsList');
        
        this.initializeEventListeners();
        this.setupKeyboardShortcuts();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.toggleStart());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleStart();
            } else if (e.code === 'KeyL' && !this.lapBtn.disabled) {
                e.preventDefault();
                this.recordLap();
            } else if (e.code === 'KeyR' && !this.resetBtn.disabled) {
                e.preventDefault();
                this.reset();
            }
        });
    }
    
    toggleStart() {
        if (!this.isRunning) {
            this.start();
        } else {
            this.pause();
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateTime(), 10);
            this.isRunning = true;
            this.updateButtonStates();
        }
    }
    
    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.updateButtonStates();
        }
    }
    
    resume() {
        this.start();
    }
    
    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.display.textContent = '00:00:00.00';
        this.laps = [];
        this.updateLapsDisplay();
        this.updateButtonStates();
    }
    
    recordLap() {
        if (this.isRunning) {
            this.laps.unshift(this.elapsedTime); // Add to beginning for reverse chronological order
            this.updateLapsDisplay();
        }
    }
    
    updateTime() {
        this.elapsedTime = Date.now() - this.startTime;
        this.display.textContent = this.formatTime(this.elapsedTime);
    }
    
    formatTime(time) {
        const milliseconds = Math.floor((time % 1000) / 10);
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor(time / (1000 * 60 * 60));
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    
    updateButtonStates() {
        if (this.isRunning) {
            this.startBtn.textContent = 'Pause';
            this.startBtn.classList.add('running');
            this.lapBtn.disabled = false;
            this.resetBtn.disabled = false;
        } else {
            this.startBtn.textContent = this.elapsedTime > 0 ? 'Resume' : 'Start';
            this.startBtn.classList.remove('running');
            this.lapBtn.disabled = this.elapsedTime === 0;
            this.resetBtn.disabled = this.elapsedTime === 0;
        }
    }
    
    updateLapsDisplay() {
        if (this.laps.length === 0) {
            this.lapsList.innerHTML = '<div class="no-laps">No laps recorded yet</div>';
            return;
        }
        
        let lapsHTML = '';
        this.laps.forEach((lapTime, index) => {
            lapsHTML += `
                <div class="lap-item">
                    <span class="lap-number">Lap ${this.laps.length - index}</span>
                    <span class="lap-time">${this.formatTime(lapTime)}</span>
                </div>
            `;
        });
        this.lapsList.innerHTML = lapsHTML;
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const stopwatch = new Stopwatch();
});
