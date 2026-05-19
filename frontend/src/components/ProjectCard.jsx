import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Folder, Calendar, CheckCircle } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const date = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const totalTasks = project.totalTasks || 0;
  const completedTasks = project.completedTasks || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const themeColor = project.themeColor || 'var(--accent-primary)';

  return (
    <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none' }}>
      <div 
        className="glass-panel" 
        style={{
          ...styles.card,
          transform: isHovered ? 'translateY(-4px)' : 'none',
          boxShadow: isHovered ? `0 12px 30px ${themeColor.startsWith('#') ? themeColor + '40' : 'rgba(99, 102, 241, 0.25)'}` : 'none',
          borderColor: isHovered ? (themeColor.startsWith('#') ? themeColor + '66' : 'rgba(99, 102, 241, 0.4)') : 'var(--border-color)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.header}>
          <div style={{...styles.iconWrapper, background: themeColor.startsWith('#') ? themeColor + '26' : 'rgba(99, 102, 241, 0.15)'}}>
            <Folder size={20} color={themeColor} />
          </div>
          <h3 style={styles.title}>{project.name}</h3>
        </div>
        <p style={styles.description}>{project.description}</p>
        
        {/* Progress Bar Section */}
        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span style={styles.progressText}>Progress</span>
            <span style={styles.progressPercent}>{progressPercent}%</span>
          </div>
          <div style={styles.progressBarBg}>
            <div 
              style={{
                ...styles.progressBarFill, 
                width: `${progressPercent}%`,
                background: progressPercent === 100 ? 'var(--success)' : themeColor
              }}
            ></div>
          </div>
        </div>

        <div style={styles.footer}>
          <div style={styles.meta}>
            <Calendar size={14} />
            <span>{date}</span>
          </div>
          <div style={styles.meta}>
            <CheckCircle size={14} color={progressPercent === 100 ? 'var(--success)' : 'var(--text-secondary)'} />
            <span>{completedTasks}/{totalTasks}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    padding: '24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'var(--text-primary)',
    fontSize: '20px',
    margin: 0,
    fontWeight: 600,
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    lineHeight: '1.6',
    flex: 1,
    marginBottom: '20px',
  },
  progressContainer: {
    marginBottom: '20px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  progressText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  progressPercent: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  progressBarBg: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: 500,
  }
};

export default ProjectCard;
