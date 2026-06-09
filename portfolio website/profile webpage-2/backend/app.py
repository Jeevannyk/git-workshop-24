"""
Contact Form Backend - Flask + SQLite
Simple, lightweight backend to store contact form submissions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import re
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Database configuration
DATABASE = os.path.join(os.path.dirname(__file__), 'contacts.db')


def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database with contacts table"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT
        )
    ''')
    conn.commit()
    conn.close()


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def sanitize_input(text):
    """Basic input sanitization"""
    if text is None:
        return ''
    # Remove potential script tags and trim whitespace
    text = re.sub(r'<[^>]*script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<[^>]*>', '', text)
    return text.strip()


def is_duplicate_submission(conn, name, email, message):
    """Check for duplicate submissions within last 5 minutes"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT COUNT(*) FROM contacts 
        WHERE name = ? AND email = ? AND message = ?
        AND submitted_at > datetime('now', '-5 minutes')
    ''', (name, email, message))
    count = cursor.fetchone()[0]
    return count > 0


@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Handle contact form submission"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Extract and sanitize fields
        name = sanitize_input(data.get('name', ''))
        email = sanitize_input(data.get('email', ''))
        subject = sanitize_input(data.get('subject', ''))
        message = sanitize_input(data.get('message', ''))
        
        # Validation
        errors = []
        
        if not name or len(name) < 2:
            errors.append('Name must be at least 2 characters')
        
        if not email:
            errors.append('Email is required')
        elif not validate_email(email):
            errors.append('Invalid email format')
        
        if not message or len(message) < 10:
            errors.append('Message must be at least 10 characters')
        
        if len(name) > 100:
            errors.append('Name is too long (max 100 characters)')
        
        if len(email) > 150:
            errors.append('Email is too long (max 150 characters)')
        
        if len(message) > 5000:
            errors.append('Message is too long (max 5000 characters)')
        
        if errors:
            return jsonify({
                'success': False,
                'errors': errors
            }), 400
        
        # Database operations
        conn = get_db()
        
        # Check for duplicate submission
        if is_duplicate_submission(conn, name, email, message):
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Duplicate submission detected. Please wait before submitting again.'
            }), 429
        
        # Insert the contact
        cursor = conn.cursor()
        ip_address = request.remote_addr
        
        cursor.execute('''
            INSERT INTO contacts (name, email, subject, message, ip_address)
            VALUES (?, ?, ?, ?, ?)
        ''', (name, email, subject, message, ip_address))
        
        conn.commit()
        contact_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! I will get back to you soon.',
            'id': contact_id
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing your request.'
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })


# Initialize database on startup
init_db()

if __name__ == '__main__':
    # Read from environment so the same code runs locally and when hosted.
    # Bind to 0.0.0.0 so VS Code port forwarding (and LAN) can reach it.
    # debug defaults OFF — never expose the Werkzeug debugger on a public port.
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'

    print("Starting Contact Form Backend...")
    print(f"Database location: {DATABASE}")
    print(f"Listening on http://{host}:{port}  (debug={debug})")
    app.run(host=host, port=port, debug=debug)
