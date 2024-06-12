
### Step-by-Step Guide to Set Up Flask Application

#### Step 1: Set Up the Flask Application

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
    CORS(app)

    # Replace '<my-sql-private-ip>' with the actual private IP address of your MySQL instance
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://newuser:newpass@<my-sql-private-ip>/test_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db = SQLAlchemy(app)

    class Item(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(80), nullable=False)
        description = db.Column(db.String(200), nullable=True)

    # Function to create the database tables
    def create_tables():
        with app.app_context():
            db.create_all()

    # Call the function to create the tables
    create_tables()

    @app.route('/items', methods=['GET'])
    def get_items():
        items = Item.query.all()
        return jsonify([{'id': item.id, 'name': item.name, 'description': item.description} for item in items])

    @app.route('/item', methods=['POST'])
    def add_item():
        data = request.json
        new_item = Item(name=data['name'], description=data.get('description', ''))
        db.session.add(new_item)
        db.session.commit()
        return jsonify({'id': new_item.id}), 201

    @app.route('/item/<int:id>', methods=['PUT'])
    def update_item(id):
        data = request.json
        item = Item.query.get(id)
        if not item:
            return jsonify({'message': 'Item not found'}), 404
        item.name = data['name']
        item.description = data.get('description', '')
        db.session.commit()
        return jsonify({'message': 'Item updated'})

    @app.route('/item/<int:id>', methods=['DELETE'])
    def delete_item(id):
        item = Item.query.get(id)
        if not item:
            return jsonify({'message': 'Item not found'}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item deleted'})

    if __name__ == '__main__':
        app.run(debug=True, host='0.0.0.0')
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
EXPOSE 5000

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

