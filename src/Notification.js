// Notification.js
import React from 'react';
import './Notification.css'; // Custom styles for the notification

function Notification({ message, type }) {
  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  );
}

export default Notification;
