import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, Check, CheckCircle2, ChevronDown, Circle, Clock3, Edit3,
  CalendarDays, LayoutDashboard, ListTodo, LoaderCircle, Plus, RefreshCw, Search, Sparkles, Trash2, TrendingUp, X, Zap
} from 'lucide-react';
import { taskApi } from './api';

const emptyForm = { title: '', description: '', priority: 'medium', dueDate: '', completed: false };

function formatDate(date) {
  if (!date) return 'No due date';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`));
}

function TaskForm({ task, busy, onSave, onCancel }) {
  const [form, setForm] = useState(task || emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => setForm(task || emptyForm), [task]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Give this task a clear title.';
    if (form.title.trim().length > 80) nextErrors.title = 'Keep the title under 80 characters.';
    if (form.description.trim().length > 280) nextErrors.description = 'Keep the description under 280 characters.';
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    try {
      await onSave({ ...form, title: form.title.trim(), description: form.description.trim() });
      if (!task) setForm(emptyForm);
    } catch (error) {
      if (error.fields) setErrors(error.fields);
    }
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <div className="form-heading">
        <div>
          <span className="eyebrow">{task ? 'Update task' : 'New task'}</span>
          <h2>{task ? 'Refine the plan' : 'What needs momentum?'}</h2>
        </div>
        {task && <button className="icon-button" type="button" onClick={onCancel} aria-label="Close edit form"><X size={20} /></button>}
      </div>

      <label>
        <span>Task title</span>
        <input name="title" value={form.title} onChange={updateField} placeholder="e.g. Finalize the project demo" maxLength="80" disabled={busy} />
        {errors.title && <small className="field-error">{errors.title}</small>}
      </label>

      <label>
        <span>Description <em>Optional</em></span>
        <textarea name="description" value={form.description} onChange={updateField} placeholder="Add context, a useful note, or the next step…" rows="4" maxLength="280" disabled={busy} />
        <small className={errors.description ? 'field-error counter' : 'counter'}>{errors.description || `${form.description.length}/280`}</small>
      </label>

      <div className="form-row">
        <label>
          <span>Priority</span>
          <span className="select-wrap">
            <select name="priority" value={form.priority} onChange={updateField} disabled={busy}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <ChevronDown size={17} />
          </span>
        </label>
        <label>
          <span>Due date <em>Optional</em></span>
          <input type="date" name="dueDate" value={form.dueDate} onChange={updateField} disabled={busy} />
        </label>
      </div>

      <button className="primary-button" disabled={busy}>
        {busy ? <><LoaderCircle className="spin" size={18} /> Saving task…</> : task ? <><Check size={18} /> Save changes</> : <><Plus size={18} /> Add task</>}
      </button>
    </form>
  );
}

function TaskCard({ task, action, onToggle, onEdit, onDelete }) {
  const isBusy = action?.id === task.id;
  return (
    <article className={`task-card ${task.completed ? 'is-complete' : ''}`}>
      <button className="check-button" onClick={() => onToggle(task)} disabled={isBusy} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}>
        {isBusy && action.type === 'toggle' ? <LoaderCircle className="spin" size={22} /> : task.completed ? <CheckCircle2 size={23} /> : <Circle size={23} />}
      </button>
      <div className="task-copy">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority priority-${task.priority}`}>{task.priority}</span>
        </div>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta"><Clock3 size={15} /><span>{formatDate(task.dueDate)}</span></div>
      </div>
      <div className="task-actions">
        <button className="icon-button" onClick={() => onEdit(task)} disabled={isBusy} aria-label={`Edit ${task.title}`}><Edit3 size={18} /></button>
        <button className="icon-button danger" onClick={() => onDelete(task)} disabled={isBusy} aria-label={`Delete ${task.title}`}>
          {isBusy && action.type === 'delete' ? <LoaderCircle className="spin" size={18} /> : <Trash2 size={18} />}
        </button>
      </div>
    </article>
  );
}

function ConfirmDialog({ task, busy, onConfirm, onCancel }) {
  useEffect(() => {
    const close = (event) => event.key === 'Escape' && !busy && onCancel();
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [busy, onCancel]);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onCancel()}>
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="dialog-icon"><Trash2 size={22} /></div>
        <h2 id="delete-title">Delete this task?</h2>
        <p>“{task.title}” will be permanently removed. This action cannot be undone.</p>
        <div className="dialog-actions">
          <button className="secondary-button" onClick={onCancel} disabled={busy}>Keep task</button>
          <button className="delete-button" onClick={onConfirm} disabled={busy}>
            {busy ? <><LoaderCircle className="spin" size={17} /> Deleting…</> : <><Trash2 size={17} /> Delete task</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState(null);
  const [action, setAction] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      setTasks(await taskApi.list());
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const completed = tasks.filter((task) => task.completed).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === 'all' || (filter === 'completed' ? task.completed : !task.completed);
    const searchText = `${task.title} ${task.description}`.toLowerCase();
    return matchesFilter && searchText.includes(query.trim().toLowerCase());
  }), [tasks, filter, query]);

  async function createTask(values) {
    setAction({ type: 'create' });
    try {
      const task = await taskApi.create(values);
      setTasks((current) => [task, ...current]);
      setNotice({ type: 'success', text: 'Task added to your plan.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
      throw error;
    } finally {
      setAction(null);
    }
  }

  async function updateTask(values) {
    setAction({ type: 'update', id: editing.id });
    try {
      const task = await taskApi.update(editing.id, values);
      setTasks((current) => current.map((item) => item.id === task.id ? task : item));
      setEditing(null);
      setNotice({ type: 'success', text: 'Changes saved successfully.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
      throw error;
    } finally {
      setAction(null);
    }
  }

  async function toggleTask(task) {
    setAction({ type: 'toggle', id: task.id });
    try {
      const updated = await taskApi.update(task.id, { ...task, completed: !task.completed });
      setTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice({ type: 'success', text: updated.completed ? 'Nice work — task completed!' : 'Task moved back to active.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setAction(null);
    }
  }

  async function deleteTask() {
    setAction({ type: 'delete', id: deleting.id });
    try {
      await taskApi.remove(deleting.id);
      setTasks((current) => current.filter((task) => task.id !== deleting.id));
      if (editing?.id === deleting.id) setEditing(null);
      setDeleting(null);
      setNotice({ type: 'success', text: 'Task deleted.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setAction(null);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Momentum home"><span><Sparkles size={18} /></span><strong>momentum</strong></a>
        <div className="sidebar-section"><span className="sidebar-label">Workspace</span><nav aria-label="Task views">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}><LayoutDashboard size={18} /> Overview <span>{tasks.length}</span></button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}><Zap size={18} /> Active tasks <span>{tasks.length - completed}</span></button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}><CheckCircle2 size={18} /> Completed <span>{completed}</span></button>
        </nav></div>
        <div className="sidebar-focus"><div className="focus-icon"><TrendingUp size={19} /></div><span>Weekly focus</span><strong>{progress}% complete</strong><div className="mini-progress"><i style={{ width: `${progress}%` }} /></div><p>{completed ? `${completed} task${completed === 1 ? '' : 's'} completed. Keep the momentum going.` : 'Complete your first task to start your streak.'}</p></div>
        <div className="sidebar-status"><i /><span>API connected</span></div>
      </aside>

      <div className="app-main">
        <header className="topbar"><div><span className="mobile-brand">momentum</span><h1>Task command center</h1></div><div className="date-chip"><CalendarDays size={17} /><span>{new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span></div></header>
        <main id="top" className="dashboard">
          <section className="welcome-banner">
            <div className="welcome-copy"><span className="eyebrow">Focus. Execute. Grow.</span><h2>Turn today’s priorities<br />into visible progress.</h2><p>A focused workspace for capturing ideas, organizing priorities, and finishing the work that matters.</p><button className="banner-button" onClick={() => { setEditing(null); document.querySelector('.task-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}><Plus size={18} /> Create a task</button></div>
            <div className="progress-visual"><div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` }}><div><strong>{progress}%</strong><span>complete</span></div></div><div className="progress-caption"><strong>{completed} of {tasks.length}</strong><span>tasks completed</span></div></div>
          </section>
          <section className="metrics-grid" aria-label="Task statistics">
            <article><div className="metric-icon blue"><ListTodo size={20} /></div><div><span>Total tasks</span><strong>{tasks.length}</strong><small>Everything in your workspace</small></div></article>
            <article><div className="metric-icon amber"><Zap size={20} /></div><div><span>In progress</span><strong>{tasks.length - completed}</strong><small>Tasks requiring attention</small></div></article>
            <article><div className="metric-icon green"><CheckCircle2 size={20} /></div><div><span>Completed</span><strong>{completed}</strong><small>Your finished milestones</small></div></article>
          </section>
          <section className="workspace">
            <div className="task-panel">
              <div className="panel-heading"><div><span className="eyebrow">Your workflow</span><h2>Priority queue</h2><p>Stay focused on what moves the work forward.</p></div><span className="task-count">{filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}</span></div>
              <div className="toolbar"><div className="filters" role="group" aria-label="Filter tasks">{[{ value: 'all', count: tasks.length }, { value: 'active', count: tasks.length - completed }, { value: 'completed', count: completed }].map(({ value, count }) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}<span>{count}</span></button>)}</div><label className="search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your workspace" aria-label="Search tasks" /></label></div>
              {loading ? <div className="state-card"><LoaderCircle className="spin" size={30} /><h3>Loading your workspace...</h3><p>Fetching the latest tasks from the API.</p></div> : loadError ? <div className="state-card error-state"><AlertCircle size={30} /><h3>Couldn’t load your tasks</h3><p>{loadError}</p><button className="secondary-button" onClick={loadTasks}><RefreshCw size={17} /> Try again</button></div> : filteredTasks.length ? <div className="task-list">{filteredTasks.map((task) => <TaskCard key={task.id} task={task} action={action} onToggle={toggleTask} onEdit={(selected) => { setEditing(selected); document.querySelector('.task-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} onDelete={setDeleting} />)}</div> : <div className="state-card"><div className="empty-icon"><ListTodo size={27} /></div><h3>{tasks.length ? 'No matching tasks' : 'Your workspace is clear'}</h3><p>{tasks.length ? 'Adjust your search or choose another filter.' : 'Create your first task and start building momentum.'}</p>{tasks.length > 0 && <button className="secondary-button" onClick={() => { setQuery(''); setFilter('all'); }}><X size={17} /> Clear filters</button>}</div>}
            </div>
            <aside className="composer"><TaskForm task={editing} busy={action?.type === 'create' || action?.type === 'update'} onSave={editing ? updateTask : createTask} onCancel={() => setEditing(null)} /></aside>
          </section>
        </main>
        <footer><span>Momentum workspace</span><p>Full-stack CRUD powered by React + Express</p></footer>
      </div>
      {notice && <div className={`toast ${notice.type}`} role="status">{notice.type === 'success' ? <CheckCircle2 size={19} /> : <AlertCircle size={19} />}<span>{notice.text}</span><button onClick={() => setNotice(null)} aria-label="Dismiss notification"><X size={17} /></button></div>}
      {deleting && <ConfirmDialog task={deleting} busy={action?.type === 'delete'} onConfirm={deleteTask} onCancel={() => setDeleting(null)} />}
    </div>
  );
}