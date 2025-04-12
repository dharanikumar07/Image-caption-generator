import sqlite3
from flask import request, jsonify
import bcrypt
from flask import Flask, render_template
import secrets

DB_NAME = "icg-db.db"

class UserController:
    def __init__(self):
        self._create_users_table()
        self._create_settings_table()

    def _connect_db(self):
        """Connect to SQLite database."""
        return sqlite3.connect(DB_NAME)

    def _create_users_table(self):
        """Create users table if it doesn't exist."""
        conn = self._connect_db()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                preferred_language TEXT DEFAULT 'en',
                user_tokens TEXT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def _create_settings_table(self):
        """Create settings table if it doesn't exist."""
        conn = self._connect_db()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                preferred_language TEXT DEFAULT 'en',
                automate_translate BOOLEAN DEFAULT 0,
                speech_voice TEXT DEFAULT 'female',
                automate_speech BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        conn.commit()
        conn.close()


    def register(self):
        """Register a new user."""
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        preferred_language = data.get("preferred_language", "en")  # Default to 'en'

        if not username or not email or not password:
            return jsonify({"error": "All fields are required."}), 400

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        try:
            conn = self._connect_db()
            cursor = conn.cursor()

            # Check if email already exists
            cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
            if cursor.fetchone():
                conn.close()
                return jsonify({"error": "Your email is already registered."}), 400

            # Insert new user
            cursor.execute("INSERT INTO users (username, email, password, preferred_language) VALUES (?, ?, ?, ?)",
                           (username, email, hashed_password, preferred_language))
            conn.commit()
            conn.close()

            return jsonify({"message": "Registration successful!"}), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def login(self):
        """User login."""
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "All fields are required."}), 400

        conn = self._connect_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id, password FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user or not bcrypt.checkpw(password.encode('utf-8'), user[1].encode('utf-8')):
            conn.close()
            return jsonify({"error": "Invalid email or password."}), 401

        user_id = user[0]
        token = secrets.token_hex(16)  # Generates a secure 32-character token

        # Store token in DB
        cursor.execute("UPDATE users SET user_tokens = ? WHERE id = ?", (token, user_id))
        conn.commit()
        conn.close()

        return jsonify({"message": "Login successful!", "token": token}), 200

    def forgot_password(self):
        """Forgot password feature."""
        data = request.get_json()
        email = data.get("email")
        new_password = data.get("password")

        if not email or not new_password:
            return jsonify({"error": "Email and new password are required."}), 400

        conn = self._connect_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return jsonify({"error": "We couldn't find an account with this email."}), 404

        # Hash the new password before storing
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Update the user's password
        cursor.execute("UPDATE users SET password = ? WHERE email = ?", (hashed_password, email))
        conn.commit()
        conn.close()

        return jsonify({"message": "Your password has been reset successfully."}), 200

    def get_user_by_token(self):
        auth_header = request.headers.get("Authorization")
    
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token missing or invalid"}), 401

        token = auth_header.split(" ")[1]

        conn = self._connect_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT username, email, preferred_language, id FROM users WHERE user_tokens = ?",
            (token,)
        )
        user = cursor.fetchone()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid token"}), 401

        # Map the result to a dict
        username, email, preferred_language, id = user
        return jsonify({
            "id": id,
            "name": username,
            "email": email,
            "preferred_language": preferred_language
        }), 200

    def save_user_settings(self):
        """Save or update user settings."""
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token missing or invalid"}), 401

        token = auth_header.split(" ")[1]

        conn = self._connect_db()
        cursor = conn.cursor()

        # Get user ID using the token
        cursor.execute("SELECT id FROM users WHERE user_tokens = ?", (token,))
        result = cursor.fetchone()
        if not result:
            conn.close()
            return jsonify({"error": "Invalid token"}), 401

        user_id = result[0]

        # Parse settings from request
        data = request.get_json()
        preferred_language = data.get("preferredLanguage", "en")
        automate_translate = int(data.get("translateCaptions", False))
        speech_voice = data.get("speechVoice", "female")
        automate_speech = int(data.get("automateSpeech", False))

        # Check if settings already exist for this user
        cursor.execute("SELECT id FROM settings WHERE user_id = ?", (user_id,))
        existing = cursor.fetchone()

        if existing:
            # Update
            cursor.execute('''
                UPDATE settings
                SET preferred_language = ?, automate_translate = ?, speech_voice = ?, automate_speech = ?
                WHERE user_id = ?
            ''', (preferred_language, automate_translate, speech_voice, automate_speech, user_id))
        else:
            # Insert
            cursor.execute('''
                INSERT INTO settings (user_id, preferred_language, automate_translate, speech_voice, automate_speech)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, preferred_language, automate_translate, speech_voice, automate_speech))

        conn.commit()
        conn.close()
        return jsonify({"message": "Settings saved successfully"}), 200

    def get_user_settings(self):
        """Get user settings using token."""
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token missing or invalid"}), 401

        token = auth_header.split(" ")[1]

        conn = self._connect_db()
        cursor = conn.cursor()

        # Fetch both user_id and username
        cursor.execute("SELECT id, username FROM users WHERE user_tokens = ?", (token,))
        result = cursor.fetchone()
        if not result:
            conn.close()
            return jsonify({"error": "Invalid token"}), 401

        user_id, username = result

        # Fetch settings for the user
        cursor.execute('''
            SELECT preferred_language, automate_translate, speech_voice, automate_speech
            FROM settings
            WHERE user_id = ?
        ''', (user_id,))
        settings = cursor.fetchone()
        conn.close()

        if not settings:
            return jsonify({"message": "No settings found", "username": username}), 404

        preferred_language, automate_translate, speech_voice, automate_speech = settings
        return jsonify({
            "username": username,
            "preferredLanguage": preferred_language,
            "translateCaptions": bool(automate_translate),
            "speechVoice": speech_voice,
            "automateSpeech": bool(automate_speech)
        }), 200


