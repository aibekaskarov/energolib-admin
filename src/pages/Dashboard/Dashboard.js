import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaUser, FaPlus } from 'react-icons/fa';
import api from '../../services/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, users: 0, persons: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTotal = (resData) => {
    if (typeof resData?.total === 'number') return resData.total;
    if (typeof resData?.totalElements === 'number') return resData.totalElements;
    if (typeof resData?.count === 'number') return resData.count;
    if (Array.isArray(resData)) return resData.length;
    if (Array.isArray(resData?.content)) return resData.content.length;
    return 0;
  };

  useEffect(() => {
    Promise.all([
      api.get('/books').catch(() => ({ data: [] })),
      api.get('/users').catch(() => ({ data: [] })),
      api.get('/persons').catch(() => ({ data: [] })),
    ]).then(([booksRes, usersRes, personsRes]) => {
      const books = Array.isArray(booksRes.data) ? booksRes.data : (booksRes.data?.books || []);

      setStats({
        books: getTotal(booksRes.data),
        users: getTotal(usersRes.data),
        persons: getTotal(personsRes.data),
      });
      setRecentBooks(books.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}><FaBook /></div>
          <div>
            <div className={styles.statValue}>{stats.books}</div>
            <div className={styles.statLabel}>Всего книг</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}><FaUsers /></div>
          <div>
            <div className={styles.statValue}>{stats.users}</div>
            <div className={styles.statLabel}>Пользователей</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}><FaUser /></div>
          <div>
            <div className={styles.statValue}>{stats.persons}</div>
            <div className={styles.statLabel}>Персон (авторов)</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Быстрые действия</span>
        </div>
        <div className={styles.quickActions}>
          <Link to="/books/add" className={styles.actionBtn}>
            <FaPlus /> Добавить книгу
          </Link>
          <Link to="/persons/add" className={styles.actionBtn}>
            <FaPlus /> Добавить персону
          </Link>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Последние книги</span>
          <Link to="/books" className={styles.seeAll}>Все книги →</Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Автор</th>
              <th>Год</th>
              <th>Жанр</th>
            </tr>
          </thead>
          <tbody>
            {recentBooks.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#6a6a8a' }}>Нет данных</td></tr>
            ) : recentBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author || '—'}</td>
                <td>{book.year || '—'}</td>
                <td>{book.genre || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
