import { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from '../Books/Books.module.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    api.get('/users').then((res) => {
      setUsers(Array.isArray(res.data) ? res.data : []);
    }).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await api.put(`/users/${userId}/role`, { role: newRole }).catch(() => {});
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleDelete = async () => {
    await api.delete(`/users/${deleteId}`).catch(() => {});
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
  };

  const filtered = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.totalCount}>Всего пользователей: {users.length}</div>
      </div>

      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Email</th>
                <th>Дата регистрации</th>
                <th>Роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}><div className={styles.empty}>Пользователи не найдены</div></td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName || '—'}</td>
                  <td>{u.email}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('ru-RU') : '—'}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{
                        background: '#0f0f1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 6,
                        color: u.role === 'admin' ? '#00d9ff' : '#c0c0c0',
                        padding: '4px 8px',
                        fontSize: 13,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="student">student</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <button className={styles.deleteBtn} onClick={() => setDeleteId(u.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <div className={styles.modalTitle}>Удалить пользователя?</div>
            <div className={styles.modalText}>Это действие нельзя отменить.</div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>Отмена</button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
