import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaBook } from 'react-icons/fa';
import api from '../../services/api';
import { getMediaUrl } from '../../services/media';
import styles from './Books.module.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchBooks = () => {
    setLoading(true);
    api.get('/books').then((res) => {
      const data = Array.isArray(res.data) ? res.data : (res.data?.books || []);
      setBooks(data);
    }).catch(() => setBooks([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async () => {
    await api.delete(`/books/${deleteId}`).catch(() => {});
    setDeleteId(null);
    fetchBooks();
  };

  const filtered = books.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div />
        <Link to="/books/add" className={styles.addBtn}>
          <FaPlus /> Добавить книгу
        </Link>
      </div>

      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Поиск по названию..."
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
                <th>Обложка</th>
                <th>Название</th>
                <th>Автор</th>
                <th>Год</th>
                <th>Жанр</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.empty}>Книги не найдены</div>
                  </td>
                </tr>
              ) : filtered.map((book) => (
                <tr key={book.id}>
                  <td>
                    {book.imageUrl ? (
                      <img src={getMediaUrl(book.imageUrl)} alt={book.title} className={styles.cover} />
                    ) : (
                      <div className={styles.coverPlaceholder}><FaBook /></div>
                    )}
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author || '—'}</td>
                  <td>{book.year || '—'}</td>
                  <td>{book.genre || '—'}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/books/edit/${book.id}`} className={styles.editBtn}>Изменить</Link>
                      <button className={styles.deleteBtn} onClick={() => setDeleteId(book.id)}>Удалить</button>
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
            <div className={styles.modalTitle}>Удалить книгу?</div>
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

export default Books;
