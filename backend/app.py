"""
Flask API Server for Schrödinger's Cat Quantum Simulator
Provides REST endpoints for quantum operations
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from quantum_simulator import simulator

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Serve static files from frontend directory
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../frontend', path)

# API Routes
@app.route('/api/initialize', methods=['POST'])
def initialize_cat():
    """Initialize cat in definite state"""
    try:
        result = simulator.initialize_cat()
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/superposition', methods=['POST'])
def apply_superposition():
    """Apply Hadamard gate to create superposition"""
    try:
        result = simulator.apply_superposition()
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/measure', methods=['POST'])
def measure_cat():
    """Measure the quantum system (collapse wave function)"""
    try:
        data = request.get_json() or {}
        shots = data.get('shots', None)
        result = simulator.measure_cat(shots)
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/multiple-experiments', methods=['POST'])
def run_multiple_experiments():
    """Run multiple experiments to show probability distribution"""
    try:
        data = request.get_json() or {}
        num_experiments = data.get('num_experiments', 1000)
        result = simulator.run_multiple_experiments(num_experiments)
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/circuit/<circuit_type>', methods=['GET'])
def get_circuit_diagram(circuit_type):
    """Get ASCII representation of quantum circuit"""
    try:
        diagram = simulator.get_circuit_diagram(circuit_type)
        return jsonify({
            'success': True,
            'data': {
                'diagram': diagram,
                'type': circuit_type
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/quantum-info', methods=['GET'])
def get_quantum_info():
    """Get educational information about quantum concepts"""
    info = {
        'superposition': {
            'title': 'Quantum Superposition',
            'description': 'A quantum system can exist in multiple states simultaneously until measured.',
            'formula': '|ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1',
            'in_cat': 'Cat exists as both alive AND dead until observed'
        },
        'measurement': {
            'title': 'Quantum Measurement',
            'description': 'Measurement collapses the wave function to a definite state.',
            'formula': 'Probability of |0⟩ = |α|², Probability of |1⟩ = |β|²',
            'in_cat': 'Opening the box forces cat to be either alive OR dead'
        },
        'hadamard': {
            'title': 'Hadamard Gate',
            'description': 'Creates equal superposition from definite states.',
            'formula': 'H|0⟩ = (|0⟩ + |1⟩)/√2, H|1⟩ = (|0⟩ - |1⟩)/√2',
            'in_cat': 'Creates the 50/50 alive-dead superposition'
        }
    }
    return jsonify({
        'success': True,
        'data': info
    })

@app.route('/api/schrodinger-info', methods=['GET'])
def get_schrodinger_info():
    """Get information about Schrödinger's original paper and thought experiment"""
    info = {
        'paper': {
            'title': 'Die gegenwärtige Situation in der Quantenmechanik',
            'year': '1935',
            'author': 'Erwin Schrödinger',
            'translation': 'The Current Situation in Quantum Mechanics',
            'purpose': 'Critique of Copenhagen interpretation of quantum mechanics'
        },
        'experiment': {
            'setup': 'Cat in sealed box with radioactive atom, Geiger counter, hammer, and poison',
            'quantum_link': 'Cat\'s fate tied to quantum state of radioactive atom',
            'paradox': 'Cat becomes both alive AND dead until observed',
            'original_intent': 'Schrödinger thought this was absurd - macroscopic objects shouldn\'t be in superposition'
        },
        'quotes': [
            'Man kann auch ganz burleske Fälle konstruieren. Eine Katze wird in eine Stahlkammer gesperrt...',
            'Die Psi-Funktion des ganzen Systems würde das so zum Ausdruck bringen, daß in ihr die lebende und die tote Katze zu gleichen Teilen gemischt oder verschmiert sind.',
            'Das Typische an solchen Fällen ist, daß eine ursprünglich auf den Atombereich beschränkte Unbestimmtheit sich in grobsinnliche Unbestimmtheit umsetzt.'
        ],
        'modern_relevance': {
            'quantum_computing': 'Superposition enables quantum parallelism',
            'cat_states': 'Term "cat state" now used for any macroscopic superposition',
            'experiments': 'Real experiments have created superposition with photons, ions, and even small mechanical resonators'
        }
    }
    return jsonify({
        'success': True,
        'data': info
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
