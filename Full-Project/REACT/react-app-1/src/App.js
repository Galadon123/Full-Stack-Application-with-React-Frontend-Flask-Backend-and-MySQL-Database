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
