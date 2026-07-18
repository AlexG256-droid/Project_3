import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TravelPlans from './pages/TravelPlans';
import AddTrip from './pages/AddTrip';
import Login, { Profile } from './pages/Login';
import { getCurrentUser } from './pages/api.js';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login onAuth={setUser} />}
        />
        <Route
          path="/"
          element={user ? <Home onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={user ? <Profile user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/trips"
          element={user ? <TravelPlans onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/trips/new"
          element={user ? <AddTrip /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
