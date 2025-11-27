import { useAuth } from '../context/AuthContext.jsx';

export default function Header({ onAddClick, onProfileClick }) {
  const { user } = useAuth();

  return (
    <header className="page-header" id="profile">
      <div>
        <p className="eyebrow">Today&apos;s Focus</p>
        <h1>Welcome back, {user?.name || 'Planner'} 👋</h1>
        <p className="muted">Track, prioritize, and celebrate every milestone.</p>
      </div>
      <div className="profile">
        <div className="profile-meta">
          <p>{user?.name}</p>
          <span>{user?.email}</span>
        </div>
        <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <button className="ghost-btn" onClick={onProfileClick}>
          Edit Profile
        </button>
        <button className="primary-btn" onClick={onAddClick}>
          + New Task
        </button>
      </div>
    </header>
  );
}

