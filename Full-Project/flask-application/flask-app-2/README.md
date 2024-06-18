
##  Flask Application-2 Setup

#### Step 1: Set Up the Flask Application directory

1. **Create a New Directory for Your Flask Project**:

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

#### Step 2: Create Dockerfile

Create a `Dockerfile` in the root directory of your Flask project:

```Dockerfile
# Use the official Python image as the base image
FROM python:3.8-slim

# Set the working directory
WORKDIR /app

# Copy the Flask application code to the working directory
COPY . .

# Install the dependencies with specific versions
RUN pip install --no-cache-dir Flask==2.0.1 Flask-SQLAlchemy==2.5.1 Flask-CORS==3.0.10 mysql-connector-python==8.0.25 Werkzeug==2.0.1 SQLAlchemy==1.3.23

# Expose port 5000
EXPOSE 5001

# Run the Flask application
CMD ["python", "app.py"]
```

#### Step 3: Build and Run the Docker Image

1. **Build the Docker Image**:

    ```bash
    docker build -t my-flask-app .
    ```

2. **Run the Docker Container**:

    Replace `<my-sql-private-ip>` with the actual private IP address of your MySQL EC2 instance.

    ```bash
    docker run -d --name flask_container -p 5000:5000 my-flask-app
    ```

