import { useEffect } from 'react';
import './Toast.css';

function Toast({ show, message, onClose, duration = 2500 }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="toast" role="status">
      <span className="toast-icon">✓</span>
      {message}
    </div>
  );
}

export default Toast;
