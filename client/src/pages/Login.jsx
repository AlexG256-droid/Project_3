import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout } from './api.js';
import './Login.css';

function Login({ onAuth }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const user = isRegister
        ? await register(username, password)
        : await login(username, password);
      onAuth(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <div className="text-container">
        <h1 className="logo-txt">TRAVELWISE</h1>
        <h2>{isRegister ? 'Create Account' : 'Log In'}</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="username-bar"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="password-bar"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" type="submit">
            {isRegister ? 'SIGN UP' : 'LOG IN'}
          </button>
        </form>

        <p className="login-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export function Profile({ user, onLogout }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.log('failed to log out', err);
    }
    onLogout();
    navigate('/login');
  }

  return (
    <div className="login-page">
      <div className="text-container">
        <h1 className="logo-txt">TRAVELWISE</h1>
        <h2>My Profile</h2>

        <div className="profile-info">
          <div className="profile-label">Username</div>
          <div className="profile-value">{user.username}</div>
        </div>

        {user.createdAt && (
          <div className="profile-info">
            <div className="profile-label">Member since</div>
            <div className="profile-value">{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
        )}

        <button className="login-btn" onClick={handleLogout}>
          LOG OUT
        </button>

        <button className="login-btn" onClick={() => navigate('/')}>
          BACK
        </button>
      </div>
    </div>
  );
}

export default Login;
