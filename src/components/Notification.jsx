import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Match the CSS transition duration
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="bx bx-check-circle" aria-hidden="true"></i>;
      case 'error':
        return <i className="bx bx-error-circle" aria-hidden="true"></i>;
      default:
        return <i className="bx bx-info-circle" aria-hidden="true"></i>;
    }
  };

  return (
    <div
      className={`notification notification-${type} ${isClosing ? 'closing' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="notification-content">
        {getIcon()}
        <span>{message}</span>
      </div>
      <button
        className="notification-close"
        onClick={handleClose}
        aria-label="Zamknij powiadomienie"
      >
        <i className="bx bx-x" aria-hidden="true"></i>
      </button>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error']),
  duration: PropTypes.number,
  onClose: PropTypes.func,
};

export default Notification; 