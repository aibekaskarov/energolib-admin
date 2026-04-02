import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaUser } from 'react-icons/fa';
import api from '../../services/api';
import { getMediaUrl } from '../../services/media';
import styles from '../Books/Books.module.css';

const Persons = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPersons = () => {
    setLoading(true);
    api.get('/persons').then((res) => {
      const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setPersons(data);
    }).catch(() => setPersons([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPersons(); }, []);

  const handleDelete = async () => {
    await api.delete(`/persons/${deleteId}`).catch(() => {});
    setDeleteId(null);
    fetchPersons();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div />
        <Link to="/persons/add" className={styles.addBtn}>
          <FaPlus /> Добавить персону
        </Link>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Фото</th>
                <th>Имя</th>
                <th>Роль</th>
                <th>Годы жизни</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {persons.length === 0 ? (
                <tr><td colSpan={5}><div className={styles.empty}>Персоны не найдены</div></td></tr>
              ) : persons.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl ? (
                      <img src={getMediaUrl(p.imageUrl)} alt={p.name} className={styles.cover} />
                    ) : (
                      <div className={styles.coverPlaceholder}><FaUser /></div>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.role || '—'}</td>
                  <td>{p.birthYear ? `${p.birthYear} — ${p.deathYear || 'н.в.'}` : '—'}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/persons/edit/${p.id}`} className={styles.editBtn}>Изменить</Link>
                      <button className={styles.deleteBtn} onClick={() => setDeleteId(p.id)}>Удалить</button>
                    </div>
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
            <div className={styles.modalTitle}>Удалить персону?</div>
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

export default Persons;
