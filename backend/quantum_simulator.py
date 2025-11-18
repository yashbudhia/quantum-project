"""
Quantum Simulator for Schrödinger's Cat Experiment
Uses Qiskit to simulate quantum superposition and measurement
"""

import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram
import json

class SchrodingersCatSimulator:
    def __init__(self):
        """Initialize the quantum simulator with Aer backend"""
        self.backend = AerSimulator()
        self.shots = 1024
        
    def initialize_cat(self):
        """
        Initialize cat in definite state |0⟩ (alive)
        Returns circuit and state information
        """
        qc = QuantumCircuit(1)
        # Cat starts in |0⟩ state (alive)
        qc.save_statevector()
        
        # Get statevector for visualization
        from qiskit_aer import AerSimulator
        state_backend = AerSimulator(method='statevector')
        result = state_backend.run(qc).result()
        statevector = result.get_statevector()
        
        return {
            'circuit': str(qc.draw(output='text')),
            'statevector': self._format_statevector(statevector),
            'state': 'initialized',
            'description': 'Cat initialized in definite state: |alive⟩'
        }
    
    def apply_superposition(self):
        """
        Apply Hadamard gate to create superposition
        This creates the "Schrödinger's Cat" state: (|0⟩ + |1⟩)/√2
        """
        qc = QuantumCircuit(1)
        qc.h(0)  # Hadamard gate creates superposition
        qc.save_statevector()
        
        # Get statevector for visualization
        state_backend = AerSimulator(method='statevector')
        result = state_backend.run(qc).result()
        statevector = result.get_statevector()
        
        return {
            'circuit': qc.draw(output='text'),
            'statevector': self._format_statevector(statevector),
            'state': 'superposition',
            'description': 'Cat in superposition: (|alive⟩ + |dead⟩)/√2'
        }
    
    def measure_cat(self, shots=None):
        """
        Measure the quantum system (collapse wave function)
        Returns measurement results and statistics
        """
        if shots is None:
            shots = self.shots
            
        # Create circuit with superposition and measurement
        qc = QuantumCircuit(1, 1)
        qc.h(0)  # Create superposition
        qc.measure(0, 0)  # Measure (collapse)
        
        # Execute measurement
        result = self.backend.run(qc, shots=shots).result()
        counts = result.get_counts(qc)
        
        # Calculate probabilities
        total_shots = sum(counts.values())
        probabilities = {
            'alive': counts.get('0', 0) / total_shots,
            'dead': counts.get('1', 0) / total_shots
        }
        
        # Determine final state (single measurement)
        final_state = 'alive' if counts.get('0', 0) > counts.get('1', 0) else 'dead'
        
        return {
            'counts': counts,
            'probabilities': probabilities,
            'final_state': final_state,
            'shots': shots,
            'description': f'Measurement collapsed to |{final_state}⟩ state',
            'circuit': qc.draw(output='text')
        }
    
    def run_multiple_experiments(self, num_experiments=1000):
        """
        Run multiple experiments to show probability distribution
        """
        results = []
        alive_count = 0
        dead_count = 0
        
        for _ in range(num_experiments):
            result = self.measure_cat(shots=1)
            results.append(result['final_state'])
            if result['final_state'] == 'alive':
                alive_count += 1
            else:
                dead_count += 1
        
        probabilities = {
            'alive': alive_count / num_experiments,
            'dead': dead_count / num_experiments
        }
        
        return {
            'results': results,
            'probabilities': probabilities,
            'total_experiments': num_experiments,
            'alive_count': alive_count,
            'dead_count': dead_count,
            'description': f'Quantum probability distribution over {num_experiments} experiments'
        }
    
    def get_circuit_diagram(self, circuit_type='superposition'):
        """
        Get ASCII representation of quantum circuit
        """
        if circuit_type == 'superposition':
            qc = QuantumCircuit(1, 1)
            qc.h(0)
            qc.barrier()
        elif circuit_type == 'measurement':
            qc = QuantumCircuit(1, 1)
            qc.h(0)
            qc.measure(0, 0)
        else:  # initialization
            qc = QuantumCircuit(1, 1)
            qc.barrier()
        
        return qc.draw(output='text')
    
    def _format_statevector(self, statevector):
        """Format complex statevector for JSON serialization"""
        return {
            'amplitudes': [complex(amp) for amp in statevector],
            'probabilities': [abs(amp)**2 for amp in statevector],
            'basis_states': ['|alive⟩', '|dead⟩']
        }

# Create global simulator instance
simulator = SchrodingersCatSimulator()
