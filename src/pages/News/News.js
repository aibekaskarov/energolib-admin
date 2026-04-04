import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaNewspaper } from 'react-icons/fa';
import api from '../../services/api';
import { getMediaUrl } from '../../services/media';
import styles from '../Books/Books.module.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchNews = () => {
    setLoading(true);
    api.get('/news').then((res) => {
      setNews(Array.isArray(res.data) ? res.data : []);
    }).catch(() => setNews([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(); }, []);

  const handleDelete = async () => {
    await api.delete(`/news/${deleteId}`).catch(() => {});
    setDeleteId(null);
    fetchNews();
  };

  const filtered = news.filter((n) =>
    n.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.totalCount}>Всего новостей: {news.length}</div>
        <Link to="/news/add" className={styles.addBtn}>
          <FaPlus /> Добавить новость
        </Link>
      </div>

      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Поиск по заголовку..."
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
                <th>Постер</th>
                <th>Заголовок</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4}><div className={styles.empty}>Новости не найдены</div></td></tr>
              ) : filtered.map((n) => (
                <tr key={n.id}>
                  <td>
                    {n.imageUrl ? (
                      <img src={getMediaUrl(n.imageUrl)} alt={n.title} className={styles.cover} style={{ width: 64, height: 40, objectFit: 'cover' }} />
                    ) : (
                      <div className={styles.coverPlaceholder}><FaNewspaper /></div>
                    )}
                  </td>
                  <td>{n.title}</td>
                  <td>{new Date(n.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/news/edit/${n.id}`} className={styles.editBtn}>Изменить</Link>
                      <button className={styles.deleteBtn} onClick={() => setDeleteId(n.id)}>Удалить</button>
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
            <div className={styles.modalTitle}>Удалить новость?</div>
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

export default News;
