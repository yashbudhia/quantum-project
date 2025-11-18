// Quantum Visualizer for Schrödinger's Cat Quantum Simulator
// Handles quantum state visualizations and chart management

class QuantumVisualizer {
    constructor() {
        this.charts = {};
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupChartDefaults();
        console.log('Quantum Visualizer initialized');
    }

    setupCanvas() {
        // Create additional canvas for quantum field visualization
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'quantum-field-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.3;
            z-index: 1;
        `;
        
        const boxBody = document.querySelector('.box-body');
        if (boxBody) {
            boxBody.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            
            // Handle resize
            window.addEventListener('resize', () => this.resizeCanvas());
        }
    }

    resizeCanvas() {
        if (this.canvas && this.ctx) {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }
    }

    setupChartDefaults() {
        // Set default Chart.js options for quantum visualizations
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = '#2c3e50';
        Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.1)';
    }

    createBlochSphere(statevector) {
        // Create a simplified Bloch sphere visualization
        const container = document.getElementById('state-chart');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        
        const ctx = canvas.getContext('2d');
        
        // Draw Bloch sphere
        this.drawBlochSphere(ctx, statevector, canvas.width, canvas.height);
        
        // Replace existing chart with Bloch sphere
        const parent = container.parentElement;
        const existingChart = container.querySelector('canvas');
        if (existingChart) {
            existingChart.remove();
        }
        
        parent.insertBefore(canvas, parent.querySelector('.state-info'));
    }

    drawBlochSphere(ctx, statevector, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw sphere outline
        ctx.strokeStyle = '#6A0DAD';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw axes
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(centerX - radius, centerY);
        ctx.lineTo(centerX + radius, centerY);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX, centerY + radius);
        ctx.stroke();
        
        // Z-axis (ellipse for perspective)
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * 0.3, radius, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Calculate state vector position on Bloch sphere
        if (statevector && statevector.amplitudes) {
            const alpha = statevector.amplitudes[0];
            const beta = statevector.amplitudes[1];
            
            // Simplified Bloch sphere coordinates
            const theta = 2 * Math.acos(Math.abs(alpha));
            const phi = Math.atan2(beta.imaginary || 0, alpha.real || 0);
            
            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);
            
            // Draw state vector
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + x, centerY - z); // Project onto 2D
            ctx.stroke();
            
            // Draw state point
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(centerX + x, centerY - z, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Add labels
        ctx.fillStyle = '#6c757d';
        ctx.font = '12px Inter';
        ctx.fillText('|0⟩', centerX + radius + 10, centerY);
        ctx.fillText('|1⟩', centerX - radius - 30, centerY);
    }

    createQuantumFieldVisualization(state) {
        if (!this.ctx) return;
        
        // Cancel any existing animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (state === 'superposition') {
            this.animateQuantumField();
        } else {
            this.clearQuantumField();
        }
    }

    animateQuantumField() {
        const animate = () => {
            if (!this.ctx) return;
            
            const width = this.canvas.width;
            const height = this.canvas.height;
            
            // Clear with fade effect
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.ctx.fillRect(0, 0, width, height);
            
            // Draw quantum field lines
            const time = Date.now() * 0.001;
            
            for (let i = 0; i < 5; i++) {
                const x = (Math.sin(time + i) + 1) * width / 2;
                const y = (Math.cos(time * 0.7 + i) + 1) * height / 2;
                
                this.ctx.strokeStyle = `hsla(${270 + i * 20}, 70%, 60%, 0.3)`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 20 + Math.sin(time * 2 + i) * 10, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    clearQuantumField() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    createProbabilityWaveform(probabilities) {
        const container = document.getElementById('probability-chart');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        
        const ctx = canvas.getContext('2d');
        
        // Draw probability waveform
        this.drawProbabilityWaveform(ctx, probabilities, canvas.width, canvas.height);
        
        // Replace existing chart
        const parent = container.parentElement;
        const existingChart = container.querySelector('canvas');
        if (existingChart) {
            existingChart.remove();
        }
        
        parent.insertBefore(canvas, parent.querySelector('.experiment-stats'));
    }

    drawProbabilityWaveform(ctx, probabilities, width, height) {
        const padding = 20;
        const graphWidth = width - 2 * padding;
        const graphHeight = height - 2 * padding;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Draw probability bars
        const barWidth = graphWidth / 4;
        const aliveHeight = probabilities.alive * graphHeight;
        const deadHeight = probabilities.dead * graphHeight;
        
        // Alive bar
        ctx.fillStyle = 'rgba(78, 205, 196, 0.8)';
        ctx.fillRect(
            padding + barWidth * 0.5,
            height - padding - aliveHeight,
            barWidth,
            aliveHeight
        );
        
        // Dead bar
        ctx.fillStyle = 'rgba(255, 107, 107, 0.8)';
        ctx.fillRect(
            padding + barWidth * 2.5,
            height - padding - deadHeight,
            barWidth,
            deadHeight
        );
        
        // Add labels
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Alive', padding + barWidth, height - 5);
        ctx.fillText('Dead', padding + barWidth * 3, height - 5);
        
        // Add percentage labels
        ctx.fillText(
            `${(probabilities.alive * 100).toFixed(1)}%`,
            padding + barWidth,
            height - padding - aliveHeight - 5
        );
        ctx.fillText(
            `${(probabilities.dead * 100).toFixed(1)}%`,
            padding + barWidth * 3,
            height - padding - deadHeight - 5
        );
    }

    createQuantumCircuitVisualization(circuitData) {
        const container = document.getElementById('circuit-display');
        if (!container) return;
        
        // Create enhanced circuit visualization
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 150;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        
        const ctx = canvas.getContext('2d');
        this.drawQuantumCircuit(ctx, circuitData, canvas.width, canvas.height);
        
        container.innerHTML = '';
        container.appendChild(canvas);
    }

    drawQuantumCircuit(ctx, circuitData, width, height) {
        const padding = 20;
        const wireLength = width - 2 * padding;
        const wireY = height / 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw quantum wire
        ctx.strokeStyle = '#6A0DAD';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, wireY);
        ctx.lineTo(width - padding, wireY);
        ctx.stroke();
        
        // Draw circuit elements based on type
        const type = circuitData?.type || 'initialization';
        
        switch (type) {
            case 'superposition':
                this.drawHadamardGate(ctx, width / 2, wireY);
                break;
            case 'measurement':
                this.drawHadamardGate(ctx, width / 3, wireY);
                this.drawMeasurementGate(ctx, 2 * width / 3, wireY);
                break;
            default:
                // Just show wire with initial state
                this.drawInitialState(ctx, padding, wireY);
        }
        
        // Add time arrow
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width - padding, wireY + 30);
        ctx.lineTo(width - padding - 10, wireY + 25);
        ctx.lineTo(width - padding - 10, wireY + 35);
        ctx.stroke();
        
        ctx.fillStyle = '#6c757d';
        ctx.font = '10px Inter';
        ctx.fillText('Time →', width - padding + 5, wireY + 35);
    }

    drawHadamardGate(ctx, x, y) {
        const size = 30;
        
        // Draw gate box
        ctx.strokeStyle = '#4ECDC4';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(78, 205, 196, 0.1)';
        ctx.fillRect(x - size/2, y - size/2, size, size);
        ctx.strokeRect(x - size/2, y - size/2, size, size);
        
        // Draw H symbol
        ctx.fillStyle = '#4ECDC4';
        ctx.font = 'bold 16px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('H', x, y);
    }

    drawMeasurementGate(ctx, x, y) {
        const size = 30;
        
        // Draw measurement box
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 107, 107, 0.1)';
        ctx.fillRect(x - size/2, y - size/2, size, size);
        ctx.strokeRect(x - size/2, y - size/2, size, size);
        
        // Draw measurement arc
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size/3, 0, Math.PI);
        ctx.stroke();
        
        // Draw measurement arrow
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - size/3);
        ctx.stroke();
    }

    drawInitialState(ctx, x, y) {
        // Draw initial state |0⟩
        ctx.fillStyle = '#6A0DAD';
        ctx.font = '16px JetBrains Mono';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('|0⟩', x - 15, y);
    }

    createInterferencePattern() {
        const container = document.getElementById('quantum-particles');
        if (!container) return;
        
        // Create interference pattern visualization
        const pattern = document.createElement('div');
        pattern.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(106, 13, 173, 0.1) 10px,
                rgba(106, 13, 173, 0.1) 20px
            );
            animation: interference-shift 3s linear infinite;
            pointer-events: none;
            z-index: 0;
        `;
        
        container.appendChild(pattern);
        
        // Remove after animation
        setTimeout(() => pattern.remove(), 9000);
    }

    destroy() {
        // Clean up all visualizations
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove canvas
        if (this.canvas) {
            this.canvas.remove();
        }
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart.destroy) chart.destroy();
        });
        
        this.charts = {};
    }
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes interference-shift {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize quantum visualizer
document.addEventListener('DOMContentLoaded', () => {
    window.quantumVisualizer = new QuantumVisualizer();
});
