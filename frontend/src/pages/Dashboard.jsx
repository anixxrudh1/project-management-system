import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import Navbar from '../components/Navbar';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', themeColor: '#6366f1' });
  
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '', themeColor: '#6366f1' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (authLoading || loading) return <div style={styles.loader}>Loading...</div>;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Workflow Dashboard</h1>
            <p style={styles.subtitle}>Overview of your team's projects and progress</p>
          </div>
          <button className="btn-primary" style={styles.addBtn} onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        </div>

        {/* Workflow Overview Stats */}
        {projects.length > 0 && (
          <div style={styles.statsGrid}>
            <div className="glass-panel" style={styles.statCard}>
              <div style={styles.statValue}>{projects.length}</div>
              <div style={styles.statLabel}>Active Projects</div>
            </div>
            <div className="glass-panel" style={styles.statCard}>
              <div style={styles.statValue}>
                {projects.reduce((acc, p) => acc + (p.totalTasks || 0), 0)}
              </div>
              <div style={styles.statLabel}>Total Tasks</div>
            </div>
            <div className="glass-panel" style={styles.statCard}>
              <div style={{...styles.statValue, color: 'var(--success)'}}>
                {projects.reduce((acc, p) => acc + (p.completedTasks || 0), 0)}
              </div>
              <div style={styles.statLabel}>Completed Tasks</div>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="glass-panel" style={styles.emptyState}>
            <h3>No projects yet</h3>
            <p>Create your first project to get started.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: '16px' }}>
              Create Project
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modal}>
            <h2 style={{ marginBottom: '24px' }}>Create New Project</h2>
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={styles.label}>Project Name</label>
                <input 
                  type="text" 
                  value={newProject.name} 
                  onChange={e => setNewProject({...newProject, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label style={styles.label}>Description</label>
                <textarea 
                  value={newProject.description} 
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  rows="4"
                  required 
                />
              </div>
              <div>
                <label style={styles.label}>Project Theme Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewProject({...newProject, themeColor: color})}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: newProject.themeColor === color ? '3px solid white' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      title={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div style={styles.modalActions}>
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Project</button>
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
    alignItems: 'flex-end',
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderTop: '2px solid rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    paddingBottom: '40px',
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'var(--text-secondary)',
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

export default Dashboard;
