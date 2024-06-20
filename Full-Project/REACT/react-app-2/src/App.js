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
              value={item.payment_amount.toString()} 
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
