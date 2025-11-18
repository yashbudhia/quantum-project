// Main JavaScript file for Schrödinger's Cat Quantum Simulator
// Handles user interactions and API communication

class QuantumCatSimulator {
    constructor() {
        this.currentState = 'ready';
        this.quantumData = null;
        this.charts = {};
        this.apiBase = 'http://localhost:5000/api';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initCharts();
        this.loadEducationalContent();
        console.log('Quantum Cat Simulator initialized');
    }

    bindEvents() {
        // Button event listeners
        document.getElementById('btn-initialize').addEventListener('click', () => this.initializeCat());
        document.getElementById('btn-superposition').addEventListener('click', () => this.applySuperposition());
        document.getElementById('btn-measure').addEventListener('click', () => this.measureCat());
        document.getElementById('btn-multiple').addEventListener('click', () => this.runMultipleExperiments());
        document.getElementById('btn-reset').addEventListener('click', () => this.resetSimulation());
    }

    async initializeCat() {
        try {
            this.showLoading(true);
            this.updateStatus('Initializing quantum system...');
            
            const response = await fetch(`${this.apiBase}/initialize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.quantumData = result.data;
                this.currentState = 'initialized';
                this.updateUI('initialized');
                this.updateStateChart(result.data.statevector);
                this.displayCircuit('initialization');
                this.updateStatus(result.data.description);
                this.enableButton('btn-superposition');
                this.disableButton('btn-measure');
                
                // Show cat in alive state
                window.catAnimation.showState('alive');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showError('Failed to initialize quantum system: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async applySuperposition() {
        try {
            this.showLoading(true);
            this.updateStatus('Applying Hadamard gate - creating superposition...');
            
            const response = await fetch(`${this.apiBase}/superposition`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.quantumData = result.data;
                this.currentState = 'superposition';
                this.updateUI('superposition');
                this.updateStateChart(result.data.statevector);
                this.displayCircuit('superposition');
                this.updateStatus(result.data.description);
                this.enableButton('btn-measure');
                
                // Show cat in superposition state
                window.catAnimation.showState('superposition');
                this.createQuantumParticles();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showError('Failed to create superposition: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async measureCat() {
        try {
            this.showLoading(true);
            this.updateStatus('Performing quantum measurement...');
            
            const response = await fetch(`${this.apiBase}/measure`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.quantumData = result.data;
                this.currentState = 'measured';
                this.updateUI('measured');
                this.updateProbabilityChart(result.data.probabilities);
                this.displayCircuit('measurement');
                this.updateStatus(result.data.description);
                this.disableButton('btn-measure');
                
                // Open box and show measurement result
                await this.performMeasurement(result.data.final_state);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showError('Failed to measure quantum system: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async runMultipleExperiments() {
        try {
            this.showLoading(true);
            this.updateStatus('Running 1000 quantum experiments...');
            
            const response = await fetch(`${this.apiBase}/multiple-experiments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ num_experiments: 1000 })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.updateProbabilityChart(result.data.probabilities);
                this.updateExperimentStats(result.data);
                this.updateStatus(result.data.description);
                
                // Animate the results
                this.animateExperimentResults(result.data);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showError('Failed to run experiments: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    resetSimulation() {
        this.currentState = 'ready';
        this.quantumData = null;
        this.updateUI('ready');
        this.updateStatus('Ready to begin quantum experiment');
        this.disableButton('btn-superposition');
        this.disableButton('btn-measure');
        
        // Reset charts
        this.resetCharts();
        
        // Reset cat animation
        window.catAnimation.hideAllStates();
        window.catAnimation.closeBox();
        
        // Clear circuit display
        document.getElementById('circuit-display').innerHTML = '<pre>Waiting for quantum operation...</pre>';
        
        // Clear quantum particles
        this.clearQuantumParticles();
    }

    async performMeasurement(finalState) {
        // Open the box
        window.catAnimation.openBox();
        
        // Wait for box to open
        await this.delay(600);
        
        // Show measurement collapse animation
        window.catAnimation.performMeasurement();
        
        // Wait for collapse animation
        await this.delay(800);
        
        // Show final state
        window.catAnimation.showState(finalState);
        
        // Update status based on result
        if (finalState === 'alive') {
            this.updateStatus('🎉 The cat is ALIVE! Quantum measurement collapsed to |alive⟩ state');
        } else {
            this.updateStatus('😔 The cat is DEAD. Quantum measurement collapsed to |dead⟩ state');
        }
    }

    createQuantumParticles() {
        const container = document.getElementById('quantum-particles');
        container.innerHTML = '';
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'quantum-particle';
                
                // Random starting position
                const startX = Math.random() * 100;
                const startY = Math.random() * 100;
                
                // Random ending position
                const endX = (Math.random() - 0.5) * 200;
                const endY = (Math.random() - 0.5) * 200;
                
                particle.style.left = startX + '%';
                particle.style.top = startY + '%';
                particle.style.setProperty('--tx', endX + 'px');
                particle.style.setProperty('--ty', endY + 'px');
                particle.style.animation = 'quantum-particle 2s ease-out forwards';
                
                container.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => particle.remove(), 2000);
            }, i * 100);
        }
    }

    clearQuantumParticles() {
        document.getElementById('quantum-particles').innerHTML = '';
    }

    updateUI(state) {
        // Update button states
        switch (state) {
            case 'ready':
                this.enableButton('btn-initialize');
                this.disableButton('btn-superposition');
                this.disableButton('btn-measure');
                break;
            case 'initialized':
                this.disableButton('btn-initialize');
                this.enableButton('btn-superposition');
                this.disableButton('btn-measure');
                break;
            case 'superposition':
                this.disableButton('btn-initialize');
                this.disableButton('btn-superposition');
                this.enableButton('btn-measure');
                break;
            case 'measured':
                this.disableButton('btn-initialize');
                this.disableButton('btn-superposition');
                this.disableButton('btn-measure');
                break;
        }
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status-text');
        statusElement.textContent = message;
        statusElement.className = 'fade-in';
    }

    updateStateChart(statevector) {
        const ctx = document.getElementById('state-chart').getContext('2d');
        
        if (this.charts.state) {
            this.charts.state.destroy();
        }
        
        this.charts.state = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: statevector.basis_states,
                datasets: [{
                    label: 'Probability Amplitude',
                    data: statevector.probabilities,
                    backgroundColor: [
                        'rgba(78, 205, 196, 0.6)',
                        'rgba(255, 107, 107, 0.6)'
                    ],
                    borderColor: [
                        'rgba(78, 205, 196, 1)',
                        'rgba(255, 107, 107, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Probability'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        
        // Update state info
        const stateInfo = document.getElementById('state-info');
        stateInfo.innerHTML = `
            <p><strong>Current State:</strong> ${this.currentState}</p>
            <p><strong>|alive⟩ amplitude:</strong> ${statevector.probabilities[0].toFixed(3)}</p>
            <p><strong>|dead⟩ amplitude:</strong> ${statevector.probabilities[1].toFixed(3)}</p>
        `;
    }

    updateProbabilityChart(probabilities) {
        const ctx = document.getElementById('probability-chart').getContext('2d');
        
        if (this.charts.probability) {
            this.charts.probability.destroy();
        }
        
        this.charts.probability = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Alive', 'Dead'],
                datasets: [{
                    data: [probabilities.alive, probabilities.dead],
                    backgroundColor: [
                        'rgba(78, 205, 196, 0.8)',
                        'rgba(255, 107, 107, 0.8)'
                    ],
                    borderColor: [
                        'rgba(78, 205, 196, 1)',
                        'rgba(255, 107, 107, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                }
            }
        });
    }

    updateExperimentStats(data) {
        const statsElement = document.getElementById('experiment-stats');
        statsElement.innerHTML = `
            <p><strong>Total Experiments:</strong> ${data.total_experiments}</p>
            <p><strong>Alive Results:</strong> ${data.alive_count} (${(data.probabilities.alive * 100).toFixed(1)}%)</p>
            <p><strong>Dead Results:</strong> ${data.dead_count} (${(data.probabilities.dead * 100).toFixed(1)}%)</p>
            <p><strong>Expected:</strong> 50% alive, 50% dead (quantum theory)</p>
        `;
    }

    async displayCircuit(type) {
        try {
            const response = await fetch(`${this.apiBase}/circuit/${type}`);
            const result = await response.json();
            
            if (result.success) {
                const circuitDisplay = document.getElementById('circuit-display');
                circuitDisplay.innerHTML = `<pre>${result.data.diagram}</pre>`;
                circuitDisplay.classList.add('fade-in');
            }
        } catch (error) {
            console.error('Failed to fetch circuit diagram:', error);
        }
    }

    async loadEducationalContent() {
        try {
            // Load quantum concepts
            const quantumResponse = await fetch(`${this.apiBase}/quantum-info`);
            const quantumResult = await quantumResponse.json();
            
            if (quantumResult.success) {
                this.displayQuantumConcepts(quantumResult.data);
            }
            
            // Load Schrödinger paper info
            const paperResponse = await fetch(`${this.apiBase}/schrodinger-info`);
            const paperResult = await paperResponse.json();
            
            if (paperResult.success) {
                this.displayPaperInfo(paperResult.data);
            }
        } catch (error) {
            console.error('Failed to load educational content:', error);
        }
    }

    displayQuantumConcepts(concepts) {
        const conceptsContainer = document.getElementById('quantum-concepts');
        let html = '';
        
        for (const [key, concept] of Object.entries(concepts)) {
            html += `
                <div class="concept-item slide-in-left">
                    <h4>${concept.title}</h4>
                    <p>${concept.description}</p>
                    <p><strong>Formula:</strong> ${concept.formula}</p>
                    <p><em>In Schrödinger's Cat: ${concept.in_cat}</em></p>
                </div>
            `;
        }
        
        conceptsContainer.innerHTML = html;
    }

    displayPaperInfo(paperInfo) {
        const paperContainer = document.getElementById('paper-info');
        
        let quotesHtml = '';
        paperInfo.quotes.forEach(quote => {
            quotesHtml += `<p>"${quote}"</p>`;
        });
        
        paperInfo.quotes = quotesHtml;
        
        paperContainer.innerHTML = `
            <div class="paper-info-content slide-in-right">
                <div class="concept-item">
                    <h4>Original Paper (1935)</h4>
                    <p><strong>Title:</strong> ${paperInfo.paper.title}</p>
                    <p><strong>Author:</strong> ${paperInfo.paper.author}</p>
                    <p><strong>Purpose:</strong> ${paperInfo.paper.purpose}</p>
                </div>
                
                <div class="concept-item">
                    <h4>The Thought Experiment</h4>
                    <p>${paperInfo.experiment.setup}</p>
                    <p><strong>Quantum Link:</strong> ${paperInfo.experiment.quantum_link}</p>
                    <p><strong>The Paradox:</strong> ${paperInfo.experiment.paradox}</p>
                </div>
                
                <div class="paper-quote">
                    ${quotesHtml}
                    <cite>— Erwin Schrödinger, 1935</cite>
                </div>
                
                <div class="concept-item">
                    <h4>Modern Relevance</h4>
                    <p><strong>Quantum Computing:</strong> ${paperInfo.modern_relevance.quantum_computing}</p>
                    <p><strong>Cat States:</strong> ${paperInfo.modern_relevance.cat_states}</p>
                    <p><strong>Real Experiments:</strong> ${paperInfo.modern_relevance.experiments}</p>
                </div>
            </div>
        `;
    }

    animateExperimentResults(data) {
        // Create a visual animation of the experiment results
        const resultsContainer = document.createElement('div');
        resultsContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000;
            text-align: center;
            min-width: 300px;
        `;
        
        resultsContainer.innerHTML = `
            <h3>Experiment Results</h3>
            <div style="display: flex; justify-content: space-around; margin: 20px 0;">
                <div>
                    <div style="font-size: 2rem;">🐱</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: #4ECDC4;">${data.alive_count}</div>
                    <div>Alive</div>
                </div>
                <div>
                    <div style="font-size: 2rem;">😿</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: #FF6B6B;">${data.dead_count}</div>
                    <div>Dead</div>
                </div>
            </div>
            <p style="color: #6c757d; margin-top: 15px;">Out of ${data.total_experiments} experiments</p>
            <button onclick="this.parentElement.remove()" style="
                margin-top: 20px;
                padding: 10px 20px;
                background: #6A0DAD;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Close</button>
        `;
        
        document.body.appendChild(resultsContainer);
        resultsContainer.classList.add('bounce-in');
    }

    // Utility methods
    showLoading(show) {
        const loadingElement = document.getElementById('loading');
        if (show) {
            loadingElement.classList.remove('hidden');
        } else {
            loadingElement.classList.add('hidden');
        }
    }

    showError(message) {
        this.updateStatus('❌ ' + message);
        console.error(message);
    }

    enableButton(buttonId) {
        document.getElementById(buttonId).disabled = false;
    }

    disableButton(buttonId) {
        document.getElementById(buttonId).disabled = true;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetCharts() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
        
        // Reset chart canvases
        document.getElementById('state-chart').getContext('2d').clearRect(0, 0, 300, 200);
        document.getElementById('probability-chart').getContext('2d').clearRect(0, 0, 300, 200);
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.quantumSimulator = new QuantumCatSimulator();
});
