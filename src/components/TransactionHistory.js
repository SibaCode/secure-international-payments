import React from 'react';
import PropTypes from 'prop-types';

function sanitizeInput(input) {
  return input.replace(/<[^>]+>/g, ''); // Removes all HTML tags
}

const TransactionHistory = ({ transactionDescription }) => {
  return (
    <div>
      <h3>Transaction Description</h3>
      <p>{sanitizeInput(transactionDescription)}</p>
    </div>
  );
};

TransactionHistory.propTypes = {
  transactionDescription: PropTypes.string.isRequired
};

export default TransactionHistory;
