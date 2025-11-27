import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const nextErrors = {};
    if (!emailRegex.test(form.email)) nextErrors.email = 'Enter a valid email.';
    if (!form.password.trim()) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    try {
      login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>KLU Task Hub</h1>
        {serverError && <div className="banner error">{serverError}</div>}
        <label>
          Email
          <input
            type="email"
            placeholder="team@klu.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label>
          Password
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </label>
        <button type="submit" className="primary-btn">
          Sign in
        </button>
        <p className="muted" style={{ textAlign: 'center' }}>
          No account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </div>
  );
}

