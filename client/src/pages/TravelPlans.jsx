import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './apiBase.js';
import './TravelPlans.css';

function TravelPlans() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/trips`)
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((err) => console.log('failed to load trips', err));
  }, []);

  return (
    <div className="plans-page">
      <div className="plans-header">MY TRAVEL PLANS</div>

      <div className="plans-grid">
        {trips.map((trip) => (
          <div className="trip-card" key={trip._id}>
            <div className="trip-thumb" />
            <div className="trip-name">{trip.name}</div>
            <div className="trip-dates">{trip.dates}</div>
            <div className="trip-description">{trip.description}</div>
          </div>
        ))}

        <div className="trip-card add-card" onClick={() => navigate('/trips/new')}>
          +
        </div>
      </div>

      <button className="home-btn" onClick={() => navigate('/')}>
        HOME
      </button>
    </div>
  );
}

export default TravelPlans;
