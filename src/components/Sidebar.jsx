import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Tasks', path: '/dashboard#tasks' }
];

export default function Sidebar({ onProfileClick }) {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="pulse-dot" />
        KLU Task Hub
      </div>
      <nav className="nav">
        {navItems.map((item) => (
          <NavLink key={item.label} to={item.path} className="nav-link">
            {item.label}
          </NavLink>
        ))}
        <button type="button" className="nav-link" onClick={onProfileClick}>
          Profile
        </button>
      </nav>
      <button className="ghost-btn" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}

