from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder='.')
CORS(app)

DB_FILE = "db.json"

# Ensure db.json exists
if not os.path.exists(DB_FILE):
    with open(DB_FILE, 'w') as f:
        json.dump({"produk": [], "transactions": []}, f)

def read_db():
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def write_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "OK", "message": "Server berjalan lancar 🚀"})

@app.route('/api/produk', methods=['GET'])
def get_produk():
    db = read_db()
    return jsonify(db['produk'])

@app.route('/api/produk', methods=['POST'])
def add_produk():
    db = read_db()
    new_produk = {**request.json, 'id': int(db['produk'][-1]['id'] + 1) if db['produk'] else 1}
    db['produk'].append(new_produk)
    write_db(db)
    return jsonify(new_produk), 201

@app.route('/api/produk/<int:produk_id>', methods=['DELETE'])
def delete_produk(produk_id):
    db = read_db()
    db['produk'] = [p for p in db['produk'] if p['id'] != produk_id]
    write_db(db)
    return jsonify({"success": True})

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    db = read_db()
    return jsonify(db['transactions'])

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    db = read_db()
    new_tx = {**request.json, 'id': int(db['transactions'][-1]['id'] + 1) if db['transactions'] else 1}
    db['transactions'].append(new_tx)
    write_db(db)
    return jsonify(new_tx), 201

@app.route('/api/transactions/<int:tx_id>', methods=['DELETE'])
def delete_transaction(tx_id):
    db = read_db()
    db['transactions'] = [t for t in db['transactions'] if t['id'] != tx_id]
    write_db(db)
    return jsonify({"success": True})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    if path == '' or not os.path.exists(path):
        return send_from_directory('.', 'index.html')
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
