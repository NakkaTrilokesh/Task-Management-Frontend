import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import ProfileForm from '../components/ProfileForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const keyFor = (id) => `tm_tasks_${id}`;

export default function Dashboard() {
  const { user } = useAuth();
  const storageKey = useMemo(() => (user?.id ? keyFor(user.id) : null), [user?.id]);
  const legacyKey = useMemo(
    () => (user?.email ? `tm_tasks_${user.email}` : null),
    [user?.email]
  );
  const [tasks, setTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setTasks(JSON.parse(stored));
      return;
    }
    if (legacyKey) {
      const legacy = localStorage.getItem(legacyKey);
      if (legacy) {
        localStorage.setItem(storageKey, legacy);
        localStorage.removeItem(legacyKey);
        setTasks(JSON.parse(legacy));
        return;
      }
    }
    setTasks([]);
  }, [storageKey, legacyKey]);

  useEffect(() => {
    if (activeFilter === 'all') {
      setVisibleTasks(tasks);
    } else if (activeFilter === 'pending') {
      setVisibleTasks(tasks.filter((task) => task.status !== 'completed'));
    } else {
      setVisibleTasks(tasks.filter((task) => task.status === 'completed'));
    }
  }, [tasks, activeFilter]);

  const persist = (next) => {
    setTasks(next);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(next));
    }
  };

  const handleSave = (task) => {
    setShowForm(false);
    setEditing(null);
    const exists = tasks.some((t) => t.id === task.id);
    if (exists) {
      persist(tasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      persist([task, ...tasks]);
    }
  };

  const handleDelete = (taskId) => {
    persist(tasks.filter((task) => task.id !== taskId));
  };

  const handleToggle = (taskId) => {
    persist(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      )
    );
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setShowForm(true);
  };

  return (
    <div className="app-shell">
      <Sidebar onProfileClick={() => setShowProfileEditor(true)} />
      <main className="content">
        <Header onAddClick={openCreate} onProfileClick={() => setShowProfileEditor(true)} />
        <section className="card stats">
          <div>
            <p className="muted">Open Tasks</p>
            <h2>{tasks.filter((t) => t.status !== 'completed').length}</h2>
          </div>
          <div>
            <p className="muted">Completed</p>
            <h2>{tasks.filter((t) => t.status === 'completed').length}</h2>
          </div>
          <div>
            <p className="muted">Total</p>
            <h2>{tasks.length}</h2>
          </div>
        </section>
        <div className="tabs">
          {['all', 'pending', 'completed'].map((filter) => (
            <button
              key={filter}
              className={`tab ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'all'
                ? 'All'
                : filter === 'pending'
                ? 'In Progress'
                : 'Completed'}
            </button>
          ))}
        </div>
        <TaskList tasks={visibleTasks} onEdit={openEdit} onDelete={handleDelete} onToggleStatus={handleToggle} />
      </main>
      {showForm && (
        <TaskForm task={editing} onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}
      {showProfileEditor && <ProfileForm onClose={() => setShowProfileEditor(false)} />}
    </div>
  );
}

