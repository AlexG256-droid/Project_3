import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './api.js';
import { API_BASE } from './apiBase.js';
import './Home.css';

function Home({ onLogout }) {
  const [destinations, setDestinations] = useState([]);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/destinations`)
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch((err) => console.log('failed to load destinations', err));
  }, []);

  const filtered = destinations.filter((d) => {
    const q = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q)
    );
  });

  function handleSearch(e) {
    e.preventDefault();
    setSearchTerm(query);
  }

  function addToPlan(d) {
    navigate('/trips/new', { state: { name: d.name } });
  }

  function signOut() {
    logout()
      .catch((err) => console.log('failed to log out', err))
      .finally(() => {
        onLogout();
        navigate('/login');
      });
  }

  return (
    <div className="home-page">
      <h1 className="home-title">TRAVELWISE</h1>
      <p className="home-subtitle">Where would you like to go?</p>

      <form className="home-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a country, city, or town"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">SEARCH</button>
      </form>

      <h2 className="home-section-title">Popular Destinations</h2>

      <div className="destination-grid">
        {filtered.length === 0 ? (
          <p className="no-results">No destinations match your search.</p>
        ) : (
          filtered.map((d) => (
            <div className="destination-card" key={d.name}>
              {d.image ? (
                <img className="destination-thumb" src={d.image} alt={d.name} />
              ) : (
                <div className="destination-thumb" />
              )}
              <div className="destination-name">{d.name}</div>
              <div className="destination-location">{d.location}</div>
              <button className="add-to-plan-btn" onClick={() => addToPlan(d)}>
                Add to Travel Plan
              </button>
            </div>
          ))
        )}
      </div>

      <button className="my-trips-btn" onClick={() => navigate('/trips')}>
        MY TRAVEL PLANS
      </button>

      <button className="logout-btn" onClick={signOut}>
        SIGN OUT
      </button>
    </div>
  );
}

export default Home;
