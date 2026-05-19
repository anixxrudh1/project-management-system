import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { ArrowLeft, Plus, Trash2, Search, Filter } from 'lucide-react';

const ProjectBoard = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: ''
  });

  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Failed to fetch project data', error);
      navigate('/dashboard'); // redirect if not found or unauthorized
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [id, user]);

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, newTask);
      } else {
        await api.post(`/projects/${id}/tasks`, newTask);
      }
      closeModal();
      fetchData(); // refresh tasks
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm(`Are you sure you want to delete the project "${project?.name}"? All associated tasks will be lost.`)) {
      try {
        await api.delete(`/projects/${id}`);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to delete project', error);
      }
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setNewTask(task);
    } else {
      setEditingTask(null);
      setNewTask({ title: '', description: '', priority: 'Medium', status: 'To Do', dueDate: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTask({ title: '', description: '', priority: 'Medium', status: 'To Do', dueDate: '' });
  };

  if (authLoading || loading) return <div style={styles.loader}>Loading...</div>;

  const columns = ['To Do', 'In Progress', 'Review', 'Done'];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div style={styles.header}>
          <div>
            <button className="btn-outline" style={styles.backBtn} onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={16} /> Back to Projects
            </button>
            <h1 style={styles.title}>{project?.name}</h1>
            <p style={styles.subtitle}>{project?.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-outline" 
              style={{...styles.addBtn, color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)'}} 
              onClick={handleDeleteProject}
            >
              <Trash2 size={18} /> Delete Project
            </button>
            <button className="btn-primary" style={styles.addBtn} onClick={() => openModal()}>
              <Plus size={18} /> Add Task
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.searchWrapper}>
            <Search size={16} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterWrapper}>
            <Filter size={16} style={styles.filterIcon} />
            <select 
              value={priorityFilter} 
              onChange={e => setPriorityFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div style={styles.board}>
          {columns.map(col => (
            <div key={col} style={styles.column}>
              <div style={styles.colHeader}>
                <h3 style={styles.colTitle}>{col}</h3>
                <span style={styles.countBadge}>
                  {filteredTasks.filter(t => t.status === col).length}
                </span>
              </div>
              <div style={styles.taskList}>
                {filteredTasks.filter(t => t.status === col).map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onTaskUpdate={fetchData} 
                    onTaskDelete={fetchData}
                    onEdit={openModal}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modal}>
            <h2 style={{ marginBottom: '24px' }}>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleSaveTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={styles.label}>Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label style={styles.label}>Description</label>
                <textarea 
                  value={newTask.description} 
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Status</label>
                  <select 
                    value={newTask.status} 
                    onChange={e => setNewTask({...newTask, status: e.target.value})}
                  >
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Priority</label>
                  <select 
                    value={newTask.priority} 
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={styles.label}>Due Date</label>
                <input 
                  type="date" 
                  value={newTask.dueDate ? newTask.dueDate.split('T')[0] : ''} 
                  onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{editingTask ? 'Save Changes' : 'Add Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '24px',
    color: 'var(--accent-primary)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  title: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
    maxWidth: '600px',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  toolbar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center'
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    maxWidth: '400px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)'
  },
  searchInput: {
    width: '100%',
    paddingLeft: '36px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  filterWrapper: {
    position: 'relative',
  },
  filterIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)',
    pointerEvents: 'none'
  },
  filterSelect: {
    paddingLeft: '36px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    minWidth: '150px'
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    alignItems: 'start',
    paddingBottom: '40px',
    overflowX: 'auto',
    minHeight: '600px',
  },
  column: {
    background: 'rgba(18, 18, 26, 0.4)',
    borderRadius: '16px',
    padding: '16px',
    minWidth: '280px',
  },
  colHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid rgba(255,255,255,0.05)',
  },
  colTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  countBadge: {
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: '100px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
  },
  modal: {
    width: '100%',
    maxWidth: '500px',
    padding: '32px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  }
};

export default ProjectBoard;
