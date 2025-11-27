const statusBadge = {
  pending: 'badge badge-muted',
  completed: 'badge badge-success'
};

const priorityBadge = {
  high: 'badge badge-high',
  medium: 'badge badge-medium',
  low: 'badge badge-low'
};

export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  if (!tasks.length) {
    return (
      <div className="card empty-state" id="tasks">
        <h3>No tasks yet</h3>
        <p className="muted">Create your first task to kickstart the sprint.</p>
      </div>
    );
  }

  return (
    <div className="task-grid" id="tasks">
      {tasks.map((task) => (
        <article className="card task-card" key={task.id}>
          <div className="task-card-top">
            <span className={priorityBadge[task.priority]}>{task.priority}</span>
            <span className={statusBadge[task.status]}>
              {task.status === 'completed' ? 'Completed' : 'Pending'}
            </span>
          </div>
          <h3>{task.title}</h3>
          <p className="muted">{task.description}</p>
          <div className="task-meta">
            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="btn-row">
            <button className="ghost-btn" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button className="ghost-btn" onClick={() => onDelete(task.id)}>
              Delete
            </button>
            <button className="primary-btn" onClick={() => onToggleStatus(task.id)}>
              {task.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

