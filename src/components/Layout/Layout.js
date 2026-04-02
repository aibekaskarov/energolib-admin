import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaHome, FaBook, FaUser, FaUsers, FaSignOutAlt,
} from 'react-icons/fa';
import styles from './Layout.module.css';

const pageTitles = {
  '/': 'Дашборд',
  '/books': 'Книги',
  '/books/add': 'Добавить книгу',
  '/persons': 'Персоны',
  '/persons/add': 'Добавить персону',
  '/users': 'Пользователи',
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const title = pageTitles[location.pathname] || 'Админ панель';

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoTitle}>EnergoLib</div>
          <div className={styles.logoSub}>Admin Panel</div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Основное</div>
            <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FaHome className={styles.navIcon} /> Дашборд
            </NavLink>
          </div>

          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Контент</div>
            <NavLink to="/books" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FaBook className={styles.navIcon} /> Книги
            </NavLink>
            <NavLink to="/persons" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FaUser className={styles.navIcon} /> Персоны
            </NavLink>
          </div>

          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Управление</div>
            <NavLink to="/users" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FaUsers className={styles.navIcon} /> Пользователи
            </NavLink>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className={styles.userName}>{user?.name || 'Admin'}</div>
              <div className={styles.userRole}>Администратор</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: 6 }} /> Выйти
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <span className={styles.pageTitle}>{title}</span>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
