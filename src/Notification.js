// Notification.js
import React from 'react';
import './Notification.css'; 

function Notification({ message, type }) {
  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  );
}

export default Notification;
