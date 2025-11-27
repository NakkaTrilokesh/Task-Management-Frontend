import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Name is required.';
    if (!emailRegex.test(form.email)) nextErrors.email = 'Enter a valid email.';
    if (form.password.length < 6) nextErrors.password = 'Password must be 6+ characters.';
    if (form.password !== form.confirm) nextErrors.confirm = 'Passwords do not match.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    try {
      signup(form.name.trim(), form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Join the flow</p>
        <h1>Create your workspace</h1>
        {serverError && <div className="banner error">{serverError}</div>}
        <label>
          Full Name
          <input
            type="text"
            placeholder="Avery Stone"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>
        <label>
          Work Email
          <input
            type="email"
            placeholder="avery@klu.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label>
          Password
          <input
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            placeholder="Repeat password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          {errors.confirm && <span className="error">{errors.confirm}</span>}
        </label>
        <button type="submit" className="primary-btn">
          Create account
        </button>
        <p className="muted" style={{ textAlign: 'center' }}>
          Already onboard? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

