import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileForm({ onClose }) {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      confirm: ''
    });
  }, [user]);

  const validate = () => {
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters.';
    if (!emailRegex.test(form.email)) nextErrors.email = 'Enter a valid email.';
    if (form.password && form.password.length < 6) {
      nextErrors.password = 'New password must be 6+ characters.';
    }
    if (form.password && form.password !== form.confirm) {
      nextErrors.confirm = 'Passwords do not match.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    try {
      updateProfile({
        name: form.name.trim(),
        email: form.email,
        password: form.password || undefined
      });
      onClose();
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <form className="card modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>Update Profile</h2>
          <button type="button" className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        {serverError && <div className="banner error">{serverError}</div>}
        <label>
          Full Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label>
          New Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Leave blank to keep current password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="Re-enter new password"
          />
          {errors.confirm && <span className="error">{errors.confirm}</span>}
        </label>
        <div className="btn-row">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

