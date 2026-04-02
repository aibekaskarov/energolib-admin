import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from '../Books/Books.module.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then((res) => {
      const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setUsers(data);
    }).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await api.put(`/users/${userId}/role`, { role: newRole }).catch(() => {});
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
  };

  return (
    <div className={styles.page}>
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
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={4}><div className={styles.empty}>Пользователи не найдены</div></td></tr>
              ) : users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name || u.username || '—'}</td>
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
                      <option value="user">user</option>
                      <option value="student">student</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
