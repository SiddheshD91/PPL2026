import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPlayerById, updatePlayer } from '../../services/playerService';
import type { Player } from '../../types';
import styles from './PlayerEditPage.module.css';

const PlayerEditPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    tshirtSize: '',
    dob: '',
    photo: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!playerId) return;
      try {
        const data = await getPlayerById(playerId);
        if (!data) {
          setError('Player not found');
        } else {
          setPlayer(data);
          setFormData({
            name: data.name,
            tshirtSize: data.tshirtSize.toString(),
            dob: data.dob,
            photo: null,
          });
          setPreview(data.photoUrl);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load player');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [playerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB');
      return;
    }
    setError(null);
    setFormData((prev) => ({ ...prev, photo: file }));
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId) return;
    const size = parseInt(formData.tshirtSize, 10);
    if (isNaN(size) || size < 10 || size > 50) {
      setError('T-shirt size must be between 10 and 50');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updatePlayer(playerId, {
        name: formData.name.trim(),
        tshirtSize: size,
        dob: formData.dob,
        photoFile: formData.photo,
      });
      setSuccess('Player updated');
      setTimeout(() => navigate(`/admin/players/${playerId}`), 800);
    } catch (err: any) {
      setError(err.message || 'Failed to update player');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.page}>Loading player...</div>;
  if (error && !player) return <div className={styles.page}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Edit Player</h1>
          <Link to={`/admin/players/${playerId}`} className={styles.linkButton}>Back to details</Link>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            T-shirt Size (10-50)
            <input
              type="number"
              name="tshirtSize"
              value={formData.tshirtSize}
              onChange={handleInputChange}
              className={styles.input}
              min={10}
              max={50}
              required
            />
          </label>

          <label className={styles.label}>
            Date of Birth
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            Profile Photo
            <input type="file" accept="image/*" onChange={handlePhoto} className={styles.input} />
          </label>

          {preview && (
            <div className={styles.preview}>
              <img src={preview} alt="preview" />
            </div>
          )}

          <button type="submit" className={styles.primaryButton} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerEditPage;

