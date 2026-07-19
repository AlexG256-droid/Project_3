import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './apiBase.js';
import './AddTrip.css';

function AddTrip() {
  const [name, setName] = useState('');
  const [dates, setDates] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  async function handleDone() {
    try {
      await fetch(`${API_BASE}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dates, description }),
      });
    } catch (err) {
      console.log('failed to save trip', err);
    }
    navigate('/trips');
  }

  return (
    <div className="add-trip-page">
      <div className="add-trip-header">MY TRAVEL PLANS</div>

      <div className="add-trip-form">
        <label>
          Name of trip
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Dates (to and from)
          <input value={dates} onChange={(e) => setDates(e.target.value)} />
        </label>

        <label>
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="add-trip-buttons">
          <button type="button" onClick={() => navigate('/trips')}>
            BACK
          </button>
          <button type="button" onClick={handleDone}>
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTrip;
