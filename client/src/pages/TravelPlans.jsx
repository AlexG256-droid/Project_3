import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './apiBase.js';
import { formatDateRange, validateDates, logout } from './api.js';
import Toast from '../components/Toast.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import './TravelPlans.css';

const TABS = [
  { key: 'upcoming', label: 'Not Yet Gone' },
  { key: 'ongoing', label: 'Currently Traveling' },
  { key: 'past', label: 'Past Trips' },
];

const DATE_FIELDS = ['startDate', 'endDate'];

const EMPTY_EDIT = {
  name: '',
  startDate: '',
  endDate: '',
  description: '',
  image: '',
};

function findMatch(destinations, value) {
  const q = value.trim().toLowerCase();
  if (!q) return null;
  return destinations.find((d) => d.name.toLowerCase().includes(q));
}

function TravelPlans({ onLogout }) {
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [editErrors, setEditErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  const navigate = useNavigate();

  function signOut() {
    logout()
      .catch((err) => console.log('failed to log out', err))
      .finally(() => {
        onLogout();
        navigate('/login');
      });
  }

  function loadTrips() {
    fetch(`${API_BASE}/api/trips`)
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((err) => console.log('failed to load trips', err));
  }

  useEffect(() => {
    loadTrips();
    fetch(`${API_BASE}/api/destinations`)
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch((err) => console.log('failed to load destinations', err));
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
        setToastMessage('Trip moved to Currently Traveling!');
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
        setToastMessage('Trip moved to Past Trips!');
      })
      .catch((err) => console.log('failed to update trip', err));
  }

  function confirmMove() {
    if (!moveTarget) return;
    if (moveTarget.status === 'ongoing') moveToOngoing(moveTarget.id);
    else moveToPast(moveTarget.id);
    setMoveTarget(null);
  }

  function deleteTrip(id) {
    fetch(`${API_BASE}/api/trips/${id}`, { method: 'DELETE' })
      .then(() => loadTrips())
      .catch((err) => console.log('failed to delete trip', err));
  }

  function confirmDelete() {
    deleteTrip(deleteTargetId);
    setDeleteTargetId(null);
  }

  function startEdit(trip) {
    setEditingId(trip._id);
    setEditErrors({});
    setEditForm({
      name: trip.name || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      description: trip.description || '',
      image: trip.image || '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditErrors({});
    setEditForm(EMPTY_EDIT);
  }

  // an error stops being true the moment the user edits that field, so drop it
  // instead of leaving a stale message up until the next save
  function clearEditErrors(fields) {
    const next = { ...editErrors };
    fields.forEach((field) => delete next[field]);
    setEditErrors(next);
  }

  function handleEditChange(field, value) {
    setEditForm({ ...editForm, [field]: value });
    // either date can be the reason a range is invalid, so changing one clears both
    clearEditErrors(DATE_FIELDS.includes(field) ? DATE_FIELDS : [field]);
  }

  // the picture follows the trip name, same as it does on the add trip page,
  // but a trip that already has one keeps it when the new name matches nothing
  function handleEditNameChange(value) {
    const match = findMatch(destinations, value);
    setEditForm({
      ...editForm,
      name: value,
      image: match ? match.image : editForm.image,
    });
    clearEditErrors(['name']);
  }

  function validateEdit() {
    const newErrors = {};
    const trimmedName = editForm.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Trip name is required.';
    } else if (/^\d+$/.test(trimmedName)) {
      newErrors.name = 'Trip name cannot be just a number.';
    }
    return {
      ...newErrors,
      ...validateDates(editForm.startDate, editForm.endDate),
    };
  }

  function saveEdit(id) {
    const newErrors = validateEdit();
    setEditErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    fetch(`${API_BASE}/api/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.name,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        dates: formatDateRange(editForm.startDate, editForm.endDate),
        description: editForm.description,
        image: editForm.image,
      }),
    })
      .then(() => {
        loadTrips();
        cancelEdit();
        setToastMessage('Trip updated successfully!');
      })
      .catch((err) => console.log('failed to update trip', err));
  }

  const visibleTrips = trips.filter((trip) => {
    const status = trip.status || 'upcoming';
    return status === activeTab;
  });

  return (
    <div className="plans-page">
      <div className="plans-topbar">
        <button className="home-btn" onClick={() => navigate('/')}>
          HOME
        </button>
        <button className="logout-btn" onClick={signOut}>
          SIGN OUT
        </button>
      </div>

      <h1 className="plans-header">MY TRAVEL PLANS</h1>

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
        {visibleTrips.map((trip) => {
          const isEditing = editingId === trip._id;
          const thumb = isEditing ? editForm.image : trip.image;

          return (
            <div className="trip-card" key={trip._id}>
              {thumb ? (
                <img className="trip-thumb" src={thumb} alt={trip.name} />
              ) : (
                <div className="trip-thumb" />
              )}

              {isEditing ? (
                <div className="trip-edit-form">
                  <label>
                    Name of trip
                    <input
                      value={editForm.name}
                      onChange={(e) => handleEditNameChange(e.target.value)}
                    />
                    {editErrors.name && (
                      <span className="field-error">{editErrors.name}</span>
                    )}
                  </label>

                  <label>
                    Arrival date
                    <input
                      type="date"
                      value={editForm.startDate}
                      onChange={(e) =>
                        handleEditChange('startDate', e.target.value)
                      }
                    />
                    {editErrors.startDate && (
                      <span className="field-error">{editErrors.startDate}</span>
                    )}
                  </label>

                  <label>
                    Departure date
                    <input
                      type="date"
                      value={editForm.endDate}
                      min={editForm.startDate}
                      onChange={(e) =>
                        handleEditChange('endDate', e.target.value)
                      }
                    />
                    {editErrors.endDate && (
                      <span className="field-error">{editErrors.endDate}</span>
                    )}
                  </label>

                  {/* trips saved before the calendar existed only have the
                      typed out text, so show it while the user re-picks */}
                  {!trip.startDate && trip.dates && (
                    <span className="edit-note">Previously: {trip.dates}</span>
                  )}

                  <label>
                    Description (optional)
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        handleEditChange('description', e.target.value)
                      }
                    />
                  </label>
                </div>
              ) : (
                <>
                  <div className="trip-name">{trip.name}</div>
                  <div className="trip-dates">{trip.dates}</div>
                  <div className="trip-description">{trip.description}</div>
                </>
              )}

              <div className="trip-card-actions">
                {isEditing ? (
                  <>
                    <button
                      className="move-btn"
                      onClick={() => saveEdit(trip._id)}
                    >
                      Save Changes
                    </button>
                    <button className="delete-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {(trip.status || 'upcoming') === 'upcoming' && (
                      <button
                        className="move-btn"
                        onClick={() =>
                          setMoveTarget({ id: trip._id, status: 'ongoing' })
                        }
                      >
                        Move to Currently Traveling
                      </button>
                    )}
                    {trip.status === 'ongoing' && (
                      <button
                        className="move-btn"
                        onClick={() =>
                          setMoveTarget({ id: trip._id, status: 'past' })
                        }
                      >
                        Move to Past Travel Experience
                      </button>
                    )}
                    <button className="edit-btn" onClick={() => startEdit(trip)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => setDeleteTargetId(trip._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {activeTab === 'upcoming' && (
          <div className="trip-card add-card" onClick={() => navigate('/trips/new')}>
            +
          </div>
        )}

        {visibleTrips.length === 0 && activeTab !== 'upcoming' && (
          <p className="no-trips">Nothing here yet.</p>
        )}
      </div>

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />

      <ConfirmDialog
        show={deleteTargetId !== null}
        title="Delete this trip?"
        message="Are you sure you want to delete this travel plan? This can't be undone."
        confirmLabel="Delete"
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ConfirmDialog
        show={moveTarget !== null}
        title={
          moveTarget?.status === 'ongoing'
            ? 'Move to Currently Traveling?'
            : 'Move to Past Trips?'
        }
        message={
          moveTarget?.status === 'ongoing'
            ? 'Are you sure you want to move this trip to Currently Traveling?'
            : 'Are you sure you want to move this trip to Past Trips?'
        }
        confirmLabel="Move"
        tone="primary"
        onConfirm={confirmMove}
        onCancel={() => setMoveTarget(null)}
      />
    </div>
  );
}

export default TravelPlans;
