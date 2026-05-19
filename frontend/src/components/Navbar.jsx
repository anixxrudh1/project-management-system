import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav} className="glass-panel">
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <LayoutDashboard size={24} color="var(--accent-primary)" />
          <span style={styles.logoText}>Nexus</span>
        </Link>
        <div style={styles.links}>
          {user ? (
            <>
              <span style={styles.userName}>Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn-outline" style={styles.logoutBtn}>
                <LogOut size={16} style={{ marginRight: '8px' }} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{ marginRight: '16px' }}>Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderRadius: 0,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    padding: '16px 0',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
  },
  userName: {
    color: 'var(--text-secondary)',
    marginRight: '24px',
    fontWeight: 500,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
  }
};

export default Navbar;
