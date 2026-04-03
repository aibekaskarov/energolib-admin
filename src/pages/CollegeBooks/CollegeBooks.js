import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaBook } from 'react-icons/fa';
import api from '../../services/api';
import { getMediaUrl } from '../../services/media';
import styles from '../Books/Books.module.css';

const PAGE_SIZE = 24;

const CollegeBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);

  const fetchBooks = useCallback((p, q) => {
    setLoading(true);
    const params = { page: p, source: 'manual' };
    if (q) params.search = q;
    api.get('/books', { params }).then((res) => {
      setBooks(res.data?.books || []);
      setTotal(res.data?.total || 0);
    }).catch(() => setBooks([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBooks(1, ''); }, [fetchBooks]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    setPage(1);
    fetchBooks(1, q);
  };

  const handlePage = (p) => {
    setPage(p);
    fetchBooks(p, search);
  };

  const handleDelete = async () => {
    await api.delete(`/books/${deleteId}`).catch(() => {});
    setDeleteId(null);
    fetchBooks(page, search);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.totalCount}>Всего книг колледжа: {total}</div>
        <Link to="/books/add" className={styles.addBtn}>
          <FaPlus /> Добавить книгу
        </Link>
      </div>

      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Поиск по названию или автору..."
          value={search}
          onChange={handleSearch}
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
              {books.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.empty}>Книги не найдены</div>
                  </td>
                </tr>
              ) : books.map((book) => (
                <tr key={book.id}>
                  <td>
                    {book.coverUrl ? (
                      <img src={getMediaUrl(book.coverUrl)} alt={book.title} className={styles.cover} />
                    ) : (
                      <div className={styles.coverPlaceholder}><FaBook /></div>
                    )}
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author || '—'}</td>
                  <td>{book.year || '—'}</td>
                  <td>{book.specialty || '—'}</td>
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

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={() => handlePage(page - 1)} disabled={page === 1}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) => p === '...' ? (
              <span key={`dots-${idx}`} className={styles.pageDots}>...</span>
            ) : (
              <button key={p} className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`} onClick={() => handlePage(p)}>{p}</button>
            ))
          }
          <button className={styles.pageBtn} onClick={() => handlePage(page + 1)} disabled={page === totalPages}>›</button>
        </div>
      )}

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

export default CollegeBooks;
