## React Application Setup with Docker and Docker Compose

### Requirements
- **Docker**: Ensure Docker is installed on your system. You can download and install it from [Docker's official website](https://www.docker.com/get-started).
- **Docker Compose**: This is typically installed with Docker Desktop on Windows and macOS. For Linux, you may need to install Docker Compose separately.

### React Application Code

Here is the React application code that includes fetching, adding, updating, and deleting users:

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://bus-api.students.poridhi.io/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  };

  const addItem = () => {
    axios.post('http://bus-api.students.poridhi.io/user', newUser)
      .then(response => {
        fetchUsers(); // Fetch updated users list after successfully adding user
        setNewUser({ name: '', email: '' }); // Clear input fields after adding
      })
      .catch(error => console.error(error));
  };

  const updateItem = (id) => {
    const updatedItem = users.find(item => item.id === id);
    axios.put(`http://bus-api.students.poridhi.io/user/${id}`, updatedItem)
      .then(response => console.log(response.data.message))
      .catch(error => console.error(error));
  };

  const deleteItem = (id) => {
    axios.delete(`http://bus-api.students.poridhi.io/user/${id}`)
      .then(response => {
        setUsers(users.filter(item => item.id !== id));
      })
      .catch(error => console.error(error));
  };

  const handleNameChange = (e, id) => {
    const updatedUsers = users.map(u => (u.id === id ? { ...u, name: e.target.value } : u));
    setUsers(updatedUsers);
  };

  const handleEmailChange = (e, id) => {
    const updatedUsers = users.map(u => (u.id === id ? { ...u, email: e.target.value } : u));
    setUsers(updatedUsers);
  };

  return (
    <div className="app-container">
      <h1>React App 1</h1>

      <div className="form-container">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </div>

      <button className="add-user-button" onClick={addItem} disabled={!newUser.name || !newUser.email}>Add User</button>

      <ul className="item-list">
        {users.map(item => (
          <li key={item.id} className="item-card">
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleNameChange(e, item.id)}
            />
            <input
              type="text"
              value={item.email}
              onChange={(e) => handleEmailChange(e, item.id)}
            />
            <div className="button-group">
              <button className="button-update" onClick={() => updateItem(item.id)}>Update</button>
              <button className="button-delete" onClick={() => deleteItem(item.id)}>Delete</button>
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
```

### Steps to Run the Containers

#### Step 1: Save the Compose File
Ensure you save the above Docker Compose configuration as `docker-compose.yml` in a desired directory.

#### Step 2: Build the Docker Image
Open a terminal or command prompt, navigate to the directory containing your `Dockerfile`, and run the following command to build the Docker image:

```bash
docker build -t react-app-1 .
```

#### Step 3: Launch the Containers
Navigate to the directory containing your `docker-compose.yml` file, and run the following command:

```bash
docker-compose up -d
```

This command will:
- Start the container in detached mode.
- Pull the image if it is not already present on your machine.

#### Step 4: Verify the Containers are Running
To check the status of your container, use:

```bash
docker-compose ps
```

#### Step 5: Stopping the Containers
When you are finished, you can stop the container by running:

```bash
docker-compose down
```
