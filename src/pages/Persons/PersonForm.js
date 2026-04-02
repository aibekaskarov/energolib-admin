import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { getMediaUrl } from '../../services/media';
import styles from '../Books/BookForm.module.css';

const emptyForm = { name: '', role: '', birthYear: '', deathYear: '', description: '' };

const PersonForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/persons/${id}`).then((res) => {
        const p = res.data;
        setForm({
          name: p.name || '',
          role: p.role || '',
          birthYear: p.birthYear || '',
          deathYear: p.deathYear || '',
          description: p.description || '',
        });
        if (p.imageUrl) setImagePreview(getMediaUrl(p.imageUrl));
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      if (imageFile) formData.append('image', imageFile);

      if (isEdit) {
        await api.put(`/persons/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/persons', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/persons');
    } catch {
      setError('Ошибка при сохранении.');
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
            <label className={styles.label}>Имя *</label>
            <input className={styles.input} name="name" value={form.name} onChange={handleChange} required placeholder="Полное имя" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Роль</label>
            <input className={styles.input} name="role" value={form.role} onChange={handleChange} placeholder="Писатель, Поэт..." />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Год рождения</label>
            <input className={styles.input} name="birthYear" value={form.birthYear} onChange={handleChange} placeholder="1900" type="number" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Год смерти</label>
            <input className={styles.input} name="deathYear" value={form.deathYear} onChange={handleChange} placeholder="2000 (оставьте пустым если жив)" type="number" />
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>Биография</label>
            <textarea className={styles.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Краткая биография..." style={{ minHeight: 120 }} />
          </div>

          <div className={styles.fileField}>
            <label className={styles.label}>Фото</label>
            <input type="file" accept="image/*" className={styles.fileInput} onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="preview" className={styles.preview} />}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Добавить персону')}
          </button>
          <Link to="/persons" className={styles.cancelBtn}>Отмена</Link>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
