Sure! Here is the detailed guide to setting up and running your second React application, `react-app-2`, using Docker and Docker Compose:

## React Application 2 Setup with Docker and Docker Compose

### Requirements
- **Docker**: Ensure Docker is installed on your system. You can download and install it from [Docker's official website](https://www.docker.com/get-started).
- **Docker Compose**: This is typically installed with Docker Desktop on Windows and macOS. For Linux, you may need to install Docker Compose separately.

### React Application Code

Here is the React application code that includes fetching, adding, updating, and deleting payments:

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ name: '', paymentAmount: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    axios.get('http://payment-api.students.poridhi.io/payments')
      .then(response => {
        console.log("Fetched payments:", response.data);
        setPayments(response.data);
        setError('');
      })
      .catch(error => {
        console.error(error);
        setError('Error fetching payments.');
      });
  };

  const addPayment = () => {
    const paymentData = {
      name: newPayment.name,
      paymentAmount: parseFloat(newPayment.paymentAmount) // Ensure paymentAmount is a number
    };
    if (isNaN(paymentData.paymentAmount)) {
      setError('Payment amount must be a number');
      return;
    }
    console.log("Adding payment:", paymentData);
    axios.post('http://payment-api.students.poridhi.io/payment', paymentData)
      .then(response => {
        console.log("Payment added:", response.data);
        fetchPayments(); // Fetch updated payments list after successfully adding payment
        setNewPayment({ name: '', paymentAmount: '' }); // Clear input fields after adding
        setError('');
      })
      .catch(error => {
        console.error(error);
        setError('Error adding payment.');
      });
  };

  const updatePayment = (id) => {
    const updatedPayment = payments.find(item => item.id === id);
    const paymentData = {
      name: updatedPayment.name,
      paymentAmount: parseFloat(updatedPayment.paymentAmount) // Ensure paymentAmount is a number
    };
    if (isNaN(paymentData.paymentAmount)) {
      setError('Payment amount must be a number');
      return;
    }
    console.log("Updating payment:", paymentData);
    axios.put(`http://payment-api.students.poridhi.io/payment/${id}`, paymentData)
      .then(response => {
        console.log(response.data.message);
        setError('');
        fetchPayments(); // Fetch updated payments list after successfully updating payment
      })
      .catch(error => {
        console.error(error);
        setError('Error updating payment.');
      });
  };

  const deletePayment = (id) => {
    console.log("Deleting payment with id:", id);
    axios.delete(`http://payment-api.students.poridhi.io/payment/${id}`)
      .then(response => {
        console.log("Payment deleted:", response.data.message);
        setPayments(payments.filter(item => item.id !== id));
        setError('');
      })
      .catch(error => {
        console.error(error);
        setError('Error deleting payment.');
      });
  };

  const handleNameChange = (e, id) => {
    const updatedPayments = payments.map(p => (p.id === id ? { ...p, name: e.target.value } : p));
    setPayments(updatedPayments);
  };

  const handlePaymentAmountChange = (e, id) => {
    const updatedPayments = payments.map(p => (p.id === id ? { ...p, paymentAmount: e.target.value } : p));
    setPayments(updatedPayments);
  };

  return (
    <div className="app-container">
      <h1>Payment App</h1>

      <div className="form-container">
        <input
          type="text"
          placeholder="Name"
          value={newPayment.name}
          onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Payment Amount"
          value={newPayment.paymentAmount}
          onChange={(e) => setNewPayment({ ...newPayment, paymentAmount: e.target.value })}
        />
      </div>

      <button className="add-user-button" onClick={addPayment} disabled={!newPayment.name || !newPayment.paymentAmount}>Add Payment</button>

      {error && <div className="error">{error}</div>}

      <ul className="item-list">
        {payments.map(item => (
          <li key={item.id} className="item-card">
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleNameChange(e, item.id)}
            />
            <input
              type="text"
              value={item.paymentAmount.toString()} 
              onChange={(e) => handlePaymentAmountChange(e, item.id)}
            />
            <div className="button-group">
              <button className="button-update" onClick={() => updatePayment(item.id)}>Update</button>
              <button className="button-delete" onClick={() => deletePayment(item.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

### Dockerfile

Create a file named `Dockerfile` with the following content to set up the Docker environment for the React application:

```Dockerfile
# Stage 1: Build the React application
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application to the working directory
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose File

Create a Docker Compose file named `docker-compose.yml` with the following configuration:

```yaml
version: '3.8'

services:
  react-app-1:
    image: react-app-1:latest
    container_name: final-react-app-1
    ports:
      - "3000:80"
    restart: unless-stopped

  react-app-2:
    image: react-app-2:latest
    container_name: final-react-app-2
    ports:
      - "3001:80"
    restart: unless-stopped
```

### Steps to Run the Containers

#### Step 1: Save the Compose File
Ensure you save the above Docker Compose configuration as `docker-compose.yml` in a desired directory.

#### Step 2: Build the Docker Image
Open a terminal or command prompt, navigate to the directory containing your `Dockerfile`, and run the following command to build the Docker image:

```bash
docker build -t react-app-2 .
```

#### Step 3: Launch the Containers
Navigate to the directory containing your `docker-compose.yml` file, and run the following command:

```bash
docker-compose up -d
```

This command will:
- Start both containers in detached mode.
- Pull the images if they are not already present on your machine.

#### Step 4: Verify the Containers are Running
To check the status of your containers, use:

```bash
docker-compose ps
```

#### Step 5: Stopping the Containers
When you are finished, you can stop the containers by running:

```bash
docker-compose down
```
