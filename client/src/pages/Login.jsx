import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, validateSignup, getPasswordChecks } from './api.js';
import './Login.css';

const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters' },
  { key: 'uppercase', label: 'One uppercase letter' },
  { key: 'special', label: 'One special character' },
];

function Login({ onAuth }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  function toggleMode() {
    setIsRegister(!isRegister);
    setError('');
    setFieldErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isRegister) {
      const newErrors = validateSignup(username, password);
      setFieldErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
    }

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

  const message = fieldErrors.username || fieldErrors.password || error;
  const passwordChecks = getPasswordChecks(password);

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
            onChange={(e) => {
              setUsername(e.target.value);
              if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: undefined });
            }}
            required
          />
          <input
            className="password-bar"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
            }}
            required
          />

          {isRegister && (
            <ul className="password-requirements">
              {PASSWORD_RULES.map((rule) => (
                <li
                  key={rule.key}
                  className={passwordChecks[rule.key] ? 'met' : ''}
                >
                  <span className="requirement-icon">
                    {passwordChecks[rule.key] ? '✓' : '•'}
                  </span>
                  {rule.label}
                </li>
              ))}
            </ul>
          )}

          {/* one fixed-height slot for whichever message applies, so the box
              never grows or shrinks as errors come and go */}
          <p className="login-error" style={{ visibility: message ? 'visible' : 'hidden' }}>
            {message || ' '}
          </p>

          <button className="login-btn" type="submit">
            {isRegister ? 'SIGN UP' : 'LOG IN'}
          </button>
        </form>

        <p className="login-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={toggleMode}>
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
