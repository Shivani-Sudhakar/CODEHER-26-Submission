from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import json
import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass
import hashlib
import secrets
from functools import wraps
from datetime import datetime
import traceback
import google.generativeai as genai

app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(32)

# API key configuration
<<<<<<< HEAD
_GEMINI_API_KEY = "AIzaSyAe2N4j4O1ESJtRDbtcJjbA7CE1gGXc908"
=======
_GEMINI_API_KEY = "AIzaSyAuipEKY5eGOje7TdMVaXzCJ2odXGS33b8"
>>>>>>> 845b11af742768d84d19180945ec94fedcc7650f
genai.configure(api_key=_GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

# Simple JSON-based user storage (replace with a real DB in production)
USERS_FILE = os.path.join(os.path.dirname(__file__), 'users.json')

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex()
    return salt, hashed

def verify_password(password, salt, hashed):
    _, check_hash = hash_password(password, salt)
    return check_hash == hashed

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user' not in session:
            if request.path.startswith('/api/'):
                return jsonify({'success': False, 'error': 'Not authenticated'}), 401
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated

def update_streak(user_data):
    """Update login streak based on last login date."""
    today = datetime.now().strftime('%Y-%m-%d')
    last_login = user_data.get('last_login', None)

    if last_login is None:
        user_data['streak'] = 1
    elif last_login == today:
        pass  # Already logged in today
    else:
        try:
            last_date = datetime.strptime(last_login, '%Y-%m-%d')
            today_date = datetime.strptime(today, '%Y-%m-%d')
            diff = (today_date - last_date).days
            if diff == 1:
                user_data['streak'] = user_data.get('streak', 0) + 1
            elif diff > 1:
                user_data['streak'] = 1
        except ValueError:
            user_data['streak'] = 1

    user_data['last_login'] = today
    return user_data

# --- Routes ---

@app.route('/')
def root():
    if 'user' in session:
        return redirect(url_for('home'))
    return redirect(url_for('login_page'))

@app.route('/login')
def login_page():
    if 'user' in session:
        return redirect(url_for('home'))
    return render_template('login.html')

@app.route('/home')
@login_required
def home():
    return render_template('index.html', username=session.get('user', ''))

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username', '').strip().lower()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    apaar_id = data.get('apaar_id', '').strip()

    if not username or not email or not password or not apaar_id:
        return jsonify({'success': False, 'error': 'All fields are required'}), 400

    if len(username) < 3:
        return jsonify({'success': False, 'error': 'Username must be at least 3 characters'}), 400

    if len(password) < 6:
        return jsonify({'success': False, 'error': 'Password must be at least 6 characters'}), 400

    if '@' not in email or '.' not in email:
        return jsonify({'success': False, 'error': 'Please enter a valid email'}), 400

    if not apaar_id.isdigit() or len(apaar_id) != 12:
        return jsonify({'success': False, 'error': 'APAAR ID must be exactly 12 digits'}), 400

    users = load_users()

    if username in users:
        return jsonify({'success': False, 'error': 'Username already taken'}), 409

    for u in users.values():
        if u.get('email') == email:
            return jsonify({'success': False, 'error': 'Email already registered'}), 409
        if u.get('apaar_id') == apaar_id:
            return jsonify({'success': False, 'error': 'APAAR ID already registered'}), 409

    salt, hashed = hash_password(password)
    today = datetime.now().strftime('%Y-%m-%d')
    users[username] = {
        'email': email,
        'apaar_id': apaar_id,
        'salt': salt,
        'password': hashed,
        'coins': 50,
        'level': 1,
        'xp': 0,
        'streak': 1,
        'skills': [],
        'hero': None,
        'player_name': '',
        'language': 'en',
        'onboarded': False,
        'last_login': today,
        'claimed_rewards': [],
        'game_state': {
            'forge_skills': {},
            'quest_progress': {},
            'enrolled_courses': []
        }
    }
    save_users(users)

    session['user'] = username
    return jsonify({'success': True, 'username': username})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('username', '').strip().lower()
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'success': False, 'error': 'All fields are required'}), 400

    users = load_users()

    found_user = None
    found_username = None
    if identifier in users:
        found_user = users[identifier]
        found_username = identifier
    else:
        for uname, udata in users.items():
            if udata.get('email') == identifier:
                found_user = udata
                found_username = uname
                break

    if not found_user:
        return jsonify({'success': False, 'error': 'Invalid username or password'}), 401

    if not verify_password(password, found_user['salt'], found_user['password']):
        return jsonify({'success': False, 'error': 'Invalid username or password'}), 401

    # Update streak on login
    update_streak(found_user)
    users[found_username] = found_user
    save_users(users)

    session['user'] = found_username
    return jsonify({'success': True, 'username': found_username})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'success': True})

@app.route('/api/me')
@login_required
def me():
    users = load_users()
    user = users.get(session['user'], {})
    return jsonify({
        'username': session['user'],
        'email': user.get('email', ''),
        'coins': user.get('coins', 50),
        'level': user.get('level', 1),
        'xp': user.get('xp', 0),
        'streak': user.get('streak', 0),
        'onboarded': user.get('onboarded', False),
        'player_name': user.get('player_name', ''),
        'skills': user.get('skills', []),
        'language': user.get('language', 'en'),
        'hero': user.get('hero', None),
        'claimed_rewards': user.get('claimed_rewards', []),
        'game_state': user.get('game_state', {})
    })

@app.route('/api/onboard', methods=['POST'])
@login_required
def onboard():
    data = request.get_json()
    player_name = data.get('player_name', '').strip()
    skills = data.get('skills', [])
    language = data.get('language', 'en')

    if not player_name:
        return jsonify({'success': False, 'error': 'Player name is required'}), 400

    if not skills or len(skills) == 0:
        return jsonify({'success': False, 'error': 'Please select at least one skill'}), 400

    users = load_users()
    username = session['user']

    if username in users:
        users[username]['player_name'] = player_name
        users[username]['skills'] = skills
        users[username]['language'] = language
        users[username]['onboarded'] = True
        save_users(users)
        return jsonify({'success': True})
    
    return jsonify({'success': False, 'error': 'User not found'}), 404

@app.route('/api/save-gamestate', methods=['POST'])
@login_required
def save_gamestate():
    data = request.get_json()
    users = load_users()
    username = session['user']

    if username in users:
        allowed_fields = ['coins', 'xp', 'level', 'streak', 'hero', 'game_state']
        for field in allowed_fields:
            if field in data:
                users[username][field] = data[field]
        save_users(users)
        return jsonify({'success': True})

    return jsonify({'success': False, 'error': 'User not found'}), 404

REWARDS_COSTS = {
    "data_pack": 600,
    "course_voucher": 800,
    "coding_workshop": 1000,
    "mentorship": 1500,
    "gift_card": 2000,
    "stationery_kit": 50
}

@app.route('/api/claim-reward', methods=['POST'])
@login_required
def claim_reward():
    data = request.get_json()
    reward_id = data.get('reward_id')

    if not reward_id:
        return jsonify({'success': False, 'error': 'Reward ID required'}), 400

    cost = REWARDS_COSTS.get(reward_id)
    if cost is None:
        return jsonify({'success': False, 'error': 'Invalid reward ID'}), 400

    pay = max(0, int(cost))

    users = load_users()
    username = session['user']
    user = users.get(username, {})

    claimed = user.get('claimed_rewards', [])
    if reward_id in claimed:
        return jsonify({'success': False, 'error': 'Already claimed'}), 400

    if pay > 0 and user.get('coins', 0) < pay:
        return jsonify({'success': False, 'error': 'Not enough coins'}), 400

    user['coins'] = user.get('coins', 0) - pay
    if 'claimed_rewards' not in user:
        user['claimed_rewards'] = []
    user['claimed_rewards'].append(reward_id)
    users[username] = user
    save_users(users)

    return jsonify({'success': True, 'coins': user['coins']})

def _chat_reply_text(response):
    """Safely read text from generate_content (handles some blocked/empty cases)."""
    try:
        return response.text.strip()
    except Exception:
        try:
            if response.candidates:
                parts = response.candidates[0].content.parts
                return "".join(getattr(p, "text", "") for p in parts).strip()
        except Exception:
            pass
    return ""


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json or {}
    message = data.get("message")
    name = data.get("name") or "Student"

    if message == "start":
        return jsonify({
            "reply": f"Hey {name}, how can I help you today?"
        })

    if not model:
        return jsonify({
            "reply": "Chat is not configured. Ask your administrator to set the GEMINI_API_KEY environment variable."
        }), 503

    if not message:
        return jsonify({"reply": "No message received"})

    structured_prompt = f"""You are an enthusiastic and friendly school tutor named "StudyBot". The reader is a student who needs answers that are **extremely easy to scan, understand, and remember**.

RESPONSE FORMAT (strictly follow this structure):

## {message}

### Quick Answer
Start with a **single, clear sentence** that directly answers the question. Use an emoji if appropriate (like: "Photosynthesis is how plants make their food!  ").

### What You Need to Know
Use **bullet points** for key facts and concepts:
- **First key concept**: Brief explanation (1-2 sentences)
- **Second key concept**: Brief explanation (1-2 sentences)  
- **Third key concept**: Brief explanation (1-2 sentences)

### Step-by-Step (if applicable)
Use **numbered list** for processes or steps:
1. **First step**: Clear action description
2. **Second step**: Clear action description
3. **Third step**: Clear action description

### Example (if helpful)
Provide a simple, relatable example:
**Example**: [Clear, practical example that students can understand]

### Remember This
Create a **memory tip** with an emoji:
**Tip**: [Easy-to-remember trick or phrase]

### Quick Check
End with **2-3 simple questions** to test understanding:
- Can you explain [main concept] in your own words?
- What would happen if [scenario]?

STYLE GUIDELINES:
- Keep paragraphs **very short** (1-2 sentences max)
- Use **bold** for important terms
- Add **blank lines** between every section
- Use emojis sparingly but effectively (, , , , )
- Avoid complex vocabulary
- Make it feel like a helpful friend, not a textbook
3. Keep **paragraphs short** (2–4 sentences). Put a blank line between sections.
4. If the topic is tricky, add a final section: `### Quick recap` with 2–4 bullet points summarizing the essentials.
5. Avoid huge walls of text. Prefer clarity over length.

Student name: {name}

Student question:
{message}
"""

    try:
        response = model.generate_content(structured_prompt)
        text = _chat_reply_text(response)
        if not text:
            return jsonify({
                "reply": "I couldn’t produce a reply for that message. Please try rephrasing your question."
            })
        return jsonify({"reply": text})

    except Exception as e:
        traceback.print_exc()
        error_msg = str(e)
        if "Quota" in error_msg or "429" in error_msg or "ResourceExhausted" in error_msg:
            return jsonify({
                "reply": "Error: API Rate limit exceeded. The API key is receiving too many requests. Please use your own API key or try again in a few moments."
            }), 500
        else:
            return jsonify({
                "reply": f"API Error: {error_msg}"
            }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
