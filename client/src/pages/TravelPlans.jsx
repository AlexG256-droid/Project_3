import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './apiBase.js';
import './TravelPlans.css';

const TABS = [
  { key: 'upcoming', label: 'Not Yet Gone' },
  { key: 'ongoing', label: 'Currently Traveling' },
  { key: 'past', label: 'Past Trips' },
];

function TravelPlans() {
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  function loadTrips() {
    fetch(`${API_BASE}/api/trips`)
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((err) => console.log('failed to load trips', err));
  }

  useEffect(() => {
    loadTrips();
  }, []);

  function moveToOngoing(id) {
    fetch(`${API_BASE}/api/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ongoing' }),
    })
      .then(() => {
        loadTrips();
        setActiveTab('ongoing');
      })
      .catch((err) => console.log('failed to update trip', err));
  }

  function moveToPast(id) {
    fetch(`${API_BASE}/api/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'past' }),
    })
      .then(() => {
        loadTrips();
        setActiveTab('past');
      })
      .catch((err) => console.log('failed to update trip', err));
  }

  function deleteTrip(id) {
    fetch(`${API_BASE}/api/trips/${id}`, { method: 'DELETE' })
      .then(() => loadTrips())
      .catch((err) => console.log('failed to delete trip', err));
  }

  const visibleTrips = trips.filter((trip) => {
    const status = trip.status || 'upcoming';
    return status === activeTab;
  });

  return (
    <div className="plans-page">
      <div className="plans-header">MY TRAVEL PLANS</div>

      <div className="tab-row">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="plans-grid">
        {visibleTrips.map((trip) => (
          <div className="trip-card" key={trip._id}>
            {trip.image ? (
              <img className="trip-thumb" src={trip.image} alt={trip.name} />
            ) : (
              <div className="trip-thumb" />
            )}
            <div className="trip-name">{trip.name}</div>
            <div className="trip-dates">{trip.dates}</div>
            <div className="trip-description">{trip.description}</div>

            <div className="trip-card-actions">
              {(trip.status || 'upcoming') === 'upcoming' && (
                <button
                  className="move-btn"
                  onClick={() => moveToOngoing(trip._id)}
                >
                  Move to Currently Traveling
                </button>
              )}
              {trip.status === 'ongoing' && (
                <button className="move-btn" onClick={() => moveToPast(trip._id)}>
                  Move to Past Travel Experience
                </button>
              )}
              <button className="delete-btn" onClick={() => deleteTrip(trip._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'upcoming' && (
          <div className="trip-card add-card" onClick={() => navigate('/trips/new')}>
            +
          </div>
        )}

        {visibleTrips.length === 0 && activeTab !== 'upcoming' && (
          <p className="no-trips">Nothing here yet.</p>
        )}
      </div>

      <button className="home-btn" onClick={() => navigate('/')}>
        HOME
      </button>
    </div>
  );
}

export default TravelPlans;
