import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE } from './apiBase.js';
<<<<<<< HEAD
=======
import { formatDateRange, validateDates } from './api.js';
>>>>>>> c887ff0 (Update)
import './AddTrip.css';

function findMatch(destinations, value) {
  const q = value.trim().toLowerCase();
  if (!q) return null;
  return destinations.find((d) => d.name.toLowerCase().includes(q));
}

function AddTrip() {
  const location = useLocation();
  const initialName = location.state?.name || '';

  const [destinations, setDestinations] = useState([]);
  const [name, setName] = useState(initialName);
<<<<<<< HEAD
  const [dates, setDates] = useState('');
=======
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
>>>>>>> c887ff0 (Update)
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/destinations`)
      .then((res) => res.json())
      .then((data) => {
        setDestinations(data);
        const match = findMatch(data, initialName);
        setImage(match ? match.image : '');
      })
      .catch((err) => console.log('failed to load destinations', err));
  }, []);

<<<<<<< HEAD
=======
  function clearErrors(fields) {
    const next = { ...errors };
    fields.forEach((field) => delete next[field]);
    setErrors(next);
  }

>>>>>>> c887ff0 (Update)
  function handleNameChange(value) {
    setName(value);
    const match = findMatch(destinations, value);
    setImage(match ? match.image : '');
<<<<<<< HEAD
=======
    clearErrors(['name']);
  }

  function handleStartDateChange(value) {
    setStartDate(value);
    clearErrors(['startDate', 'endDate']);
  }

  function handleEndDateChange(value) {
    setEndDate(value);
    clearErrors(['startDate', 'endDate']);
>>>>>>> c887ff0 (Update)
  }

  function validate() {
    const newErrors = {};
    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Trip name is required.';
    } else if (/^\d+$/.test(trimmedName)) {
      newErrors.name = 'Trip name cannot be just a number.';
    }
<<<<<<< HEAD
    if (!dates.trim()) newErrors.dates = 'Dates are required.';
    return newErrors;
=======
    return { ...newErrors, ...validateDates(startDate, endDate) };
>>>>>>> c887ff0 (Update)
  }

  async function handleDone() {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await fetch(`${API_BASE}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
        body: JSON.stringify({ name, dates, description, image }),
=======
        body: JSON.stringify({
          name,
          startDate,
          endDate,
          dates: formatDateRange(startDate, endDate),
          description,
          image,
        }),
>>>>>>> c887ff0 (Update)
      });
    } catch (err) {
      console.log('failed to save trip', err);
    }
    navigate('/trips');
  }

  return (
    <div className="add-trip-page">
<<<<<<< HEAD
      <div className="add-trip-header">MY TRAVEL PLANS</div>
=======
      <h1 className="add-trip-header">MY TRAVEL PLANS</h1>
>>>>>>> c887ff0 (Update)

      <div className="add-trip-form">
        <label>
          Name of trip
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Eiffel Tower"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        {image && (
          <img className="name-match-preview" src={image} alt="preview" />
        )}

<<<<<<< HEAD
        <label>
          Dates (to and from)
          <input value={dates} onChange={(e) => setDates(e.target.value)} />
          {errors.dates && <span className="field-error">{errors.dates}</span>}
        </label>
=======
        <div className="date-row">
          <label>
            Arrival date
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
            {errors.startDate && (
              <span className="field-error">{errors.startDate}</span>
            )}
          </label>

          <label>
            Departure date
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
            />
            {errors.endDate && (
              <span className="field-error">{errors.endDate}</span>
            )}
          </label>
        </div>
>>>>>>> c887ff0 (Update)

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
