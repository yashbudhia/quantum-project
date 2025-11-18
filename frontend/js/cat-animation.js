// Cat Animation Controller for Schrödinger's Cat Quantum Simulator
// Handles all visual animations and state transitions

class CatAnimation {
    constructor() {
        this.currentState = 'hidden';
        this.isBoxOpen = false;
        this.animationQueue = [];
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupInitialState();
        console.log('Cat Animation Controller initialized');
    }

    cacheElements() {
        this.elements = {
            box: document.getElementById('quantum-box'),
            boxLid: document.querySelector('.box-lid'),
            catAlive: document.getElementById('cat-alive'),
            catDead: document.getElementById('cat-dead'),
            catSuperposition: document.getElementById('cat-superposition'),
            catContainer: document.getElementById('cat-container'),
            statusText: document.getElementById('status-text')
        };
    }

    setupInitialState() {
        // Hide all cat states initially
        this.hideAllStates();
        
        // Ensure box is closed
        this.closeBox();
        
        // Add quantum glow effect to box
        this.elements.box.classList.add('gpu-accelerated');
    }

    showState(state) {
        if (this.isAnimating) {
            this.animationQueue.push(() => this.showState(state));
            return;
        }

        this.isAnimating = true;
        
        // Hide all states first
        this.hideAllStates();
        
        // Show the requested state with appropriate animation
        switch (state) {
            case 'alive':
                this.showAliveState();
                break;
            case 'dead':
                this.showDeadState();
                break;
            case 'superposition':
                this.showSuperpositionState();
                break;
            default:
                console.warn('Unknown cat state:', state);
        }
        
        this.currentState = state;
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
            this.processAnimationQueue();
        }, 500);
    }

    hideAllStates() {
        Object.values(this.elements).forEach(element => {
            if (element && element.classList && element.classList.contains('cat-state')) {
                element.classList.add('hidden');
                element.classList.remove('fade-in', 'bounce-in', 'measurement-collapse');
            }
        });
    }

    showAliveState() {
        const catAlive = this.elements.catAlive;
        catAlive.classList.remove('hidden');
        catAlive.classList.add('bounce-in');
        
        // Add a subtle pulse effect
        setTimeout(() => {
            catAlive.classList.add('superposition-pulse');
        }, 600);
    }

    showDeadState() {
        const catDead = this.elements.catDead;
        catDead.classList.remove('hidden');
        catDead.classList.add('fade-in');
        
        // Add a subtle shake effect
        setTimeout(() => {
            this.elements.box.classList.add('box-shake');
            setTimeout(() => {
                this.elements.box.classList.remove('box-shake');
            }, 500);
        }, 300);
    }

    showSuperpositionState() {
        const catSuperposition = this.elements.catSuperposition;
        catSuperposition.classList.remove('hidden');
        catSuperposition.classList.add('fade-in');
        
        // Add ghost floating animation
        const ghostEmoji = catSuperposition.querySelector('.cat-emoji');
        if (ghostEmoji) {
            ghostEmoji.classList.add('ghost-float');
        }
        
        // Add quantum glow to box
        this.elements.box.classList.add('quantum-glow');
        
        // Create quantum particles
        this.createQuantumFieldEffect();
    }

    async openBox() {
        if (this.isBoxOpen) return;
        
        this.isBoxOpen = true;
        const lid = this.elements.boxLid;
        
        // Add opening animation
        lid.classList.add('lid-open');
        
        // Create opening sound effect (visual pulse)
        this.createOpenBoxEffect();
        
        // Wait for animation to complete
        await this.delay(600);
    }

    async closeBox() {
        if (!this.isBoxOpen) return;
        
        this.isBoxOpen = false;
        const lid = this.elements.boxLid;
        
        // Remove open class, add close class
        lid.classList.remove('lid-open');
        lid.classList.add('lid-close');
        
        // Wait for animation to complete
        await this.delay(600);
        
        // Remove close class
        lid.classList.remove('lid-close');
    }

    async performMeasurement() {
        // Create dramatic measurement collapse animation
        const container = this.elements.catContainer;
        
        // Add measurement collapse effect
        container.classList.add('measurement-collapse');
        
        // Create measurement wave effect
        this.createMeasurementWave();
        
        // Flash effect
        this.createMeasurementFlash();
        
        // Wait for collapse animation
        await this.delay(800);
        
        // Remove collapse class
        container.classList.remove('measurement-collapse');
        
        // Remove quantum glow
        this.elements.box.classList.remove('quantum-glow');
    }

    createQuantumFieldEffect() {
        const box = this.elements.box;
        const particles = document.getElementById('quantum-particles');
        
        // Create quantum field lines
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const wave = document.createElement('div');
                wave.className = 'quantum-wave';
                wave.style.top = Math.random() * 100 + '%';
                wave.style.animationDelay = Math.random() * 2 + 's';
                particles.appendChild(wave);
                
                // Remove after animation
                setTimeout(() => wave.remove(), 4000);
            }, i * 200);
        }
    }

    createOpenBoxEffect() {
        const box = this.elements.box;
        
        // Create expanding ring effect
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            border: 3px solid rgba(106, 13, 173, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: expand-ring 1s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        box.appendChild(ring);
        
        // Remove after animation
        setTimeout(() => ring.remove(), 1000);
    }

    createMeasurementWave() {
        const box = this.elements.box;
        
        // Create measurement wave effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const wave = document.createElement('div');
                wave.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100px;
                    height: 100px;
                    border: 2px solid rgba(255, 107, 107, 0.6);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: measurement-wave 1.5s ease-out forwards;
                    pointer-events: none;
                    z-index: ${10 + i};
                `;
                
                box.appendChild(wave);
                
                // Remove after animation
                setTimeout(() => wave.remove(), 1500);
            }, i * 200);
        }
    }

    createMeasurementFlash() {
        const box = this.elements.box;
        
        // Create flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            animation: measurement-flash 0.3s ease-out forwards;
            pointer-events: none;
            z-index: 100;
        `;
        
        box.appendChild(flash);
        
        // Remove after animation
        setTimeout(() => flash.remove(), 300);
    }

    createSuccessEffect(state) {
        const box = this.elements.box;
        
        // Create success particles
        const particleCount = state === 'alive' ? 20 : 15;
        const colors = state === 'alive' 
            ? ['#4ECDC4', '#44A08D', '#5FD4CA'] 
            : ['#FF6B6B', '#FF5252', '#FF8A80'];
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const color = colors[Math.floor(Math.random() * colors.length)];
                const angle = (Math.PI * 2 * i) / particleCount;
                const distance = 100 + Math.random() * 50;
                
                particle.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 6px;
                    height: 6px;
                    background: ${color};
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: success-particle 1s ease-out forwards;
                    pointer-events: none;
                    z-index: 50;
                `;
                
                particle.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
                particle.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');
                
                box.appendChild(particle);
                
                // Remove after animation
                setTimeout(() => particle.remove(), 1000);
            }, i * 30);
        }
    }

    createErrorEffect() {
        const box = this.elements.box;
        box.classList.add('error-shake');
        
        setTimeout(() => {
            box.classList.remove('error-shake');
        }, 500);
    }

    processAnimationQueue() {
        if (this.animationQueue.length > 0) {
            const nextAnimation = this.animationQueue.shift();
            nextAnimation();
        }
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getCurrentState() {
        return this.currentState;
    }

    isBoxCurrentlyOpen() {
        return this.isBoxOpen;
    }

    reset() {
        this.hideAllStates();
        this.closeBox();
        this.currentState = 'hidden';
        this.isBoxOpen = false;
        this.animationQueue = [];
        this.isAnimating = false;
        
        // Remove any effects
        this.elements.box.classList.remove('quantum-glow', 'box-shake', 'error-shake');
        
        // Clear any remaining particles
        const particles = document.getElementById('quantum-particles');
        if (particles) {
            particles.innerHTML = '';
        }
    }
}

// Add custom CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes expand-ring {
        0% {
            width: 50px;
            height: 50px;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    @keyframes measurement-wave {
        0% {
            width: 100px;
            height: 100px;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
    
    @keyframes measurement-flash {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    
    @keyframes success-particle {
        0% {
            transform: translate(-50%, -50%);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y)));
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the cat animation controller
document.addEventListener('DOMContentLoaded', () => {
    window.catAnimation = new CatAnimation();
});
