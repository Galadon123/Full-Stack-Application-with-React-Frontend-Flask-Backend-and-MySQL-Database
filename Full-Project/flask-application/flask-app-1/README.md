
##  Flask Application-1 Setup

#### Step 1: Set Up the Flask Application directory

1. **Create a New Directory for Your Flask Project in Flask-Instance**:

    ```bash
    mkdir flask-app
    cd flask-app
    ```

2. **Create and Activate a Virtual Environment** (optional but recommended for local development):

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install Flask and Other Dependencies** (optional for local development):

    ```bash
    pip install Flask Flask-SQLAlchemy Flask-CORS mysql-connector-python
    ```

4. **Create the Flask Application**:

Create an `app.py` file with the following content:

```python
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://user:password@<mysql-instance-private-ip>/test_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Extensions
db = SQLAlchemy(app)
CORS(app)

# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

# Create Database Tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'name': user.name, 'email': user.email} for user in users])

@app.route('/user', methods=['POST'])
def add_user():
    data = request.get_json()
    new_user = User(name=data['name'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'id': new_user.id})

@app.route('/user/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    user = User.query.get(id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    user.name = data['name']
    user.email = data['email']
    db.session.commit()
    return jsonify({'message': 'User updated'})

@app.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

@app.route('/test_db', methods=['GET'])
def test_db():
    try:
        users = User.query.all()
        return jsonify({"message": "Connected to the database successfully!", "user_count": len(users)})
    except Exception as e:
        return jsonify({"message": "Failed to connect to the database.", "error": str(e)})

# Run the Application
if __name__ == '__main__':
     app.run(debug=True, host='0.0.0.0', port=5000)
```

#### Step 2: Run the application

```sh
python app.py
```
