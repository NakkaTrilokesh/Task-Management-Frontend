import { useEffect, useState } from 'react';

const blank = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: ''
};

export default function TaskForm({ task, onSave, onCancel }) {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate
      });
    } else {
      setForm(blank);
    }
  }, [task]);

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required.';
    if (form.description.trim().length < 10)
      nextErrors.description = 'Description must be at least 10 characters.';
    if (!form.dueDate) nextErrors.dueDate = 'Select a due date.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...task,
      ...form,
      id: task?.id ?? crypto.randomUUID(),
      status: task?.status ?? 'pending',
      createdAt: task?.createdAt ?? new Date().toISOString()
    });
  };

  return (
    <div className="modal-overlay">
      <form className="card modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
          <button type="button" className="icon-btn" onClick={onCancel}>
            ✕
          </button>
        </div>
        <label>
          Title
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Present quarterly roadmap"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </label>
        <label>
          Description
          <textarea
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Outline release scope, KPIs, and launch plan..."
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </label>
        <div className="form-grid">
          <label>
            Priority
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>
            Due Date
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            {errors.dueDate && <span className="error">{errors.dueDate}</span>}
          </label>
        </div>
        <div className="btn-row">
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

