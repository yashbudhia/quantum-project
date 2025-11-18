# Schrödinger's Cat Quantum Simulator

An interactive web application demonstrating quantum superposition through Erwin Schrödinger's famous thought experiment.

## Research Paper Foundation

Based on Erwin Schrödinger's 1935 paper "**Die gegenwärtige Situation in der Quantenmechanik**" (The Current Situation in Quantum Mechanics), where he introduced the cat thought experiment as a critique of the Copenhagen interpretation of quantum mechanics.

### Original Concept
> "Man kann auch ganz burleske Fälle konstruieren. Eine Katze wird in eine Stahlkammer gesperrt..."  
> *"One may construct quite burlesque situations. A cat is put into a steel box..."*

The thought experiment demonstrates how quantum superposition at the atomic level (a radioactive atom that may or may not decay) can lead to macroscopic superposition (a cat that is simultaneously alive and dead) until measurement collapses the wave function.

## Project Structure

```
quantum-project/
├── frontend/
│   ├── index.html (main simulation page)
│   ├── css/
│   │   ├── styles.css
│   │   └── animations.css
│   ├── js/
│   │   ├── main.js (main simulation logic)
│   │   ├── quantum-visualizer.js (quantum state graphs)
│   │   └── cat-animation.js (cat state animations)
│   └── assets/ (cat images, icons)
├── backend/
│   ├── app.py (Flask server)
│   ├── quantum_simulator.py (Qiskit integration)
│   └── api_routes.py (API endpoints)
├── docs/
│   ├── schrodinger_paper.md (detailed explanation)
│   └── quantum_concepts.md
└── requirements.txt
```

## Key Features

- **Real Quantum Simulation**: Uses Qiskit to simulate actual quantum circuits
- **Interactive Visualization**: Beautiful animations showing cat states and quantum superposition
- **Educational Content**: Detailed explanations of the original research and modern quantum concepts
- **Real-time Updates**: Live probability graphs and quantum circuit visualizations

## Quantum Implementation

The simulation uses a single qubit system:
- |0⟩ represents "alive" state
- |1⟩ represents "dead" state
- Hadamard gate creates superposition: (|0⟩ + |1⟩)/√2
- Measurement collapses the wave function with 50/50 probability

## Installation

```bash
# Install backend dependencies
pip install -r requirements.txt

# Run the backend server
cd backend
python app.py

# Open frontend in browser
open frontend/index.html
```

## Usage

1. **Prepare Quantum System**: Initialize the cat in a definite state
2. **Apply Superposition**: Create the "Schrödinger's Cat" state
3. **Open Box & Measure**: Collapse the wave function to observe the result
4. **Run Multiple Experiments**: See the probability distribution over many trials

## Educational Value

This project demonstrates:
- Quantum superposition and measurement
- The measurement problem in quantum mechanics
- Historical context of quantum mechanics development
- Modern applications in quantum computing

## Technologies Used

- **Backend**: Python, Flask, Qiskit
- **Frontend**: HTML5, CSS3, JavaScript, Canvas API
- **Visualization**: Chart.js, Custom animations
- **Quantum**: Real quantum circuit simulation via Qiskit
