
##  Flask Application-2 Setup

#### Step 1: Set Up the Flask Application directory

1. **Create a New Directory for Your Flask Project in Flask-instance**:

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
class Payment(db.Model):
    __tablename__ = 'paym'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    payment_amount = db.Column(db.Float, nullable=False)

# Create Database Tables if not exists
with app.app_context():
    db.create_all()

# Routes
@app.route('/payments', methods=['GET'])
def get_payments():
    payments = Payment.query.all()
    print("Fetched payments from DB:", payments)
    return jsonify([{'id': payment.id, 'name': payment.name, 'payment_amount': payment.payment_amount} for payment in payments])

@app.route('/payment', methods=['POST'])
def add_payment():
    data = request.get_json()
    print("Received new payment data:", data)
    new_payment = Payment(name=data['name'], payment_amount=data['paymentAmount'])
    db.session.add(new_payment)
    db.session.commit()
    return jsonify({'id': new_payment.id})

@app.route('/payment/<int:id>', methods=['PUT'])
def update_payment(id):
    data = request.get_json()
    print("Received update data for payment id {}: {}".format(id, data))
    payment = Payment.query.get(id)
    if payment is None:
        return jsonify({'message': 'Payment not found'}), 404
    payment.name = data['name']
    payment.payment_amount = data['paymentAmount']
    db.session.commit()
    return jsonify({'message': 'Payment updated'})

@app.route('/payment/<int:id>', methods=['DELETE'])
def delete_payment(id):
    print("Received delete request for payment id:", id)
    payment = Payment.query.get(id)
    if payment is None:
        return jsonify({'message': 'Payment not found'}), 404
    db.session.delete(payment)
    db.session.commit()
    return jsonify({'message': 'Payment deleted'})

@app.route('/test_db', methods=['GET'])
def test_db():
    try:
        payments = Payment.query.all()
        return jsonify({"message": "Connected to the database successfully!", "payment_count": len(payments)})
    except Exception as e:
        return jsonify({"message": "Failed to connect to the database.", "error": str(e)})

# Run the Application
if __name__ == '__main__':
     app.run(debug=True, host='0.0.0.0', port=5001)
```

#### Step 2: Run the application

```sh
python app.py
```
