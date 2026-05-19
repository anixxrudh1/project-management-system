import React, { useState } from 'react';
import { AlignLeft, Clock, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const TaskCard = ({ task, onTaskUpdate, onTaskDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const priorityColors = {
    Low: 'var(--success)',
    Medium: 'var(--warning)',
    High: 'var(--danger)'
  };

  let dueDateColor = 'var(--text-secondary)';
  let dueDateText = '';
  let isOverdue = false;
  if (task.dueDate) {
    const due = new Date(task.dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    dueDateText = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (diffDays < 0 && task.status !== 'Done') {
      dueDateColor = 'var(--danger)';
      isOverdue = true;
    } else if (diffDays <= 2 && task.status !== 'Done') {
      dueDateColor = 'var(--warning)';
    }
  }

  const assigneeInitials = task.assignee?.name 
    ? task.assignee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'U';

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if(window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${task._id}`);
        onTaskDelete();
      } catch (error) {
        console.error('Error deleting task', error);
      }
    }
  }

  const columns = ['To Do', 'In Progress', 'Review', 'Done'];
  const nextStatus = columns[columns.indexOf(task.status) + 1];

  return (
    <div 
      className="glass-panel" 
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
        borderColor: isHovered ? 'rgba(255,255,255,0.15)' : 'var(--border-color)',
        opacity: isUpdating ? 0.6 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.header}>
        <div style={{...styles.priorityBadge, color: priorityColors[task.priority], borderColor: priorityColors[task.priority]}}>
          {task.priority}
        </div>
        <div style={{...styles.actions, opacity: isHovered ? 1 : 0}}>
          <button onClick={() => onEdit(task)} style={styles.iconBtn} title="Edit Task">
            <Edit2 size={14} />
          </button>
          <button onClick={handleDelete} style={{...styles.iconBtn, color: 'var(--danger)'}} title="Delete Task">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <h4 style={styles.title}>{task.title}</h4>
      {task.description && (
        <div style={styles.description}>
          <AlignLeft size={14} style={{flexShrink: 0, marginTop: '2px'}} />
          <span>{task.description}</span>
        </div>
      )}
      
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <div 
            style={styles.assigneeAvatar} 
            title={task.assignee?.name || 'Unassigned'}
          >
            {assigneeInitials}
          </div>
          <div style={{...styles.date, color: dueDateColor}}>
            <Clock size={12} />
            <span style={{ fontWeight: isOverdue ? 600 : 400 }}>
              {dueDateText || new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {nextStatus && (
          <button 
            style={styles.moveBtn} 
            onClick={() => handleStatusChange(nextStatus)}
            title={`Move to ${nextStatus}`}
          >
            <CheckCircle2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '16px',
    marginBottom: '16px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    minHeight: '24px',
  },
  priorityBadge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '1px solid',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '16px',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  description: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    marginBottom: '16px',
    lineHeight: 1.5,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '12px',
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  assigneeAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 600,
    border: '2px solid rgba(255,255,255,0.1)'
  },
  date: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    transition: 'color 0.2s',
  },
  actions: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    transition: 'opacity 0.2s ease',
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  moveBtn: {
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    color: 'var(--accent-primary)',
    padding: '4px 10px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  }
};

export default TaskCard;
