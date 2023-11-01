import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Layout from '../../Components/Layout/Layout';

const PaymentSuccess = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Set a timeout to simulate the modal appearing after a delay (you can adjust the timing)
    const timer = setTimeout(() => {
      setModalIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Order Placed</h1>
        <p style={styles.message}>
          Thank you for your purchase! Your payment has been successfully processed.
        </p>
        <p style={styles.note}>An email confirmation has been sent to your registered email address.</p>
      </div>

      <Modal
        isOpen={modalIsOpen}  
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Order Confirmation"
      >
        <div style={styles.modalContent}>
          <h2 style={styles.modalHeading}>Order Confirmed</h2>
          <p>Your order has been confirmed!</p>
          <button onClick={closeModal} style={styles.closeButton}>Close</button>
        </div>
      </Modal>
    </Layout>
  );
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
};

const styles = {
  container: {
    textAlign: 'center',
    margin: '50px auto',
  },
  heading: {
    fontSize: '2em',
    color: '#4CAF50',
    marginBottom: '20px',
  },
  message: {
    fontSize: '1.2em',
    marginBottom: '20px',
  },
  note: {
    fontSize: '1em',
    color: '#888',
  },
  modalContent: {
    textAlign: 'center',
  },
  modalHeading: {
    color: '#4CAF50',
  },
  closeButton: {
    marginTop: '20px',
    padding: '8px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default PaymentSuccess; 
