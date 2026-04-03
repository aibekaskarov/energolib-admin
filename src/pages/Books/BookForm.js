import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { getMediaUrl } from '../../services/media';
import styles from './BookForm.module.css';

const emptyForm = {
  title: '', author: '', year: '', specialty: '', language: '', description: '',
};

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [persons, setPersons] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/persons').then((res) => {
      const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setPersons(data);
    }).catch(() => {});

    if (isEdit) {
      setLoading(true);
      api.get(`/books/${id}`).then((res) => {
        const b = res.data;
        setForm({
          title: b.title || '',
          author: b.author || '',
          year: b.year || '',
          specialty: b.specialty || '',
          language: b.language || '',
          description: b.description || '',
        });
        if (b.coverUrl) setImagePreview(getMediaUrl(b.coverUrl));
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      formData.append('source', 'manual');
      if (imageFile) formData.append('cover', imageFile);
      if (bookFile) formData.append('file', bookFile);

      if (isEdit) {
        await api.put(`/books/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/books');
    } catch (err) {
      setError('Ошибка при сохранении. Проверьте данные.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>Название *</label>
            <input className={styles.input} name="title" value={form.title} onChange={handleChange} required placeholder="Введите название книги" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Автор</label>
            <input className={styles.input} name="author" value={form.author} onChange={handleChange} required placeholder="Имя автора" list="persons-list" />
            <datalist id="persons-list">
              {persons.map((p) => <option key={p.id} value={p.name} />)}
            </datalist>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Год издания</label>
            <input className={styles.input} name="year" value={form.year} onChange={handleChange} placeholder="2024" type="number" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Жанр</label>
            <input className={styles.input} name="specialty" value={form.specialty} onChange={handleChange} placeholder="Роман, Поэзия..." />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Язык</label>
            <select className={styles.select} name="language" value={form.language} onChange={handleChange}>
              <option value="">Выберите язык</option>
              <option value="kz">Казахский</option>
              <option value="ru">Русский</option>
              <option value="en">Английский</option>
            </select>
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>Описание</label>
            <textarea className={styles.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Краткое описание книги..." />
          </div>

          <div className={styles.fileField}>
            <label className={styles.label}>Обложка</label>
            <input type="file" accept="image/*" className={styles.fileInput} onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="preview" className={styles.preview} />}
          </div>

          <div className={styles.fileField}>
            <label className={styles.label}>Файл книги (PDF/EPUB)</label>
            <input type="file" accept=".pdf,.epub" className={styles.fileInput} onChange={(e) => setBookFile(e.target.files[0])} />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Добавить книгу')}
          </button>
          <Link to="/books" className={styles.cancelBtn}>Отмена</Link>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
