import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { getMediaUrl } from '../../services/media';
import styles from '../Books/BookForm.module.css';

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/news/${id}`).then((res) => {
        const n = res.data;
        setForm({ title: n.title || '', content: n.content || '' });
        if (n.imageUrl) setImagePreview(getMediaUrl(n.imageUrl));
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
      formData.append('title', form.title);
      formData.append('content', form.content);
      if (imageFile) formData.append('image', imageFile);

      if (isEdit) {
        await api.put(`/news/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/news', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/news');
    } catch {
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
            <label className={styles.label}>Заголовок *</label>
            <input
              className={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Введите заголовок новости"
            />
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>Описание *</label>
            <textarea
              className={styles.textarea}
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              placeholder="Текст новости..."
              style={{ minHeight: 200 }}
            />
          </div>

          <div className={`${styles.fileField} ${styles.fullWidth}`}>
            <label className={styles.label}>Постер</label>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
              />
            )}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Добавить новость')}
          </button>
          <Link to="/news" className={styles.cancelBtn}>Отмена</Link>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
