
## Run React-App
```python
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  useEffect(() => {
    axios.get('/app1/bus/items')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const addItem = () => {
    axios.post('/app1/bus/item', newUser)
      .then(response => setUsers([...users, { ...newUser, id: response.data.id }]))
      .catch(error => console.error(error));
  };

  const updateItem = (id) => {
    const updatedItem = users.find(item => item.id === id);
    axios.put(`/app1/bus/item/${id}`, updatedItem)
      .then(response => console.log(response.data.message))
      .catch(error => console.error(error));
  };

  const deleteItem = (id) => {
    axios.delete(`/app1/bus/item/${id}`)
      .then(response => setUsers(users.filter(item => item.id !== id)))
      .catch(error => console.error(error));
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
        <button onClick={addItem} disabled={!newUser.name || !newUser.email}>Add User</button>
      </div>

      <ul className="item-list">
        {users.map(item => (
          <li key={item.id} className="item-card">
            <input
              type="text"
              value={item.name}
              onChange={(e) => setUsers(users.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
            />
            <input
              type="text"
              value={item.email}
              onChange={(e) => setUsers(users.map(i => i.id === item.id ? { ...i, email: e.target.value } : i))}
            />
            <div className="button-group">
              <button onClick={() => updateItem(item.id)}>Update</button>
              <button onClick={() => deleteItem(item.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
```
#### Instal Docker
//
 
### docker-compose

     ```
     sudo yum update -y
     sudo yum install curl gnupg -y
     sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
     sudo chmod +x /usr/local/bin/docker-compose
     ```

Create a `docker-compose.yaml`:
```bash
version: '3.8'

services:
  react-app:
    image: fazlulkarim105925/my-react-app-2:v1.0
    container_name: my-react-app
    ports:
      - "3000:80"
```

## Run the Docker Compose up command to start the container:

```bash
docker-compose up -d
```
