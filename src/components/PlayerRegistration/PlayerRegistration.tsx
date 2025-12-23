import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { createPlayer } from '../../services/playerService';
import styles from './PlayerRegistration.module.css';

const PlayerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null as File | null,
    tshirtSize: '' as number | string,
    dob: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tshirtSize' ? (value === '' ? '' : parseInt(value, 10)) : value,
    }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      // Limit to 2MB for base64 storage (will be ~33% larger when base64 encoded)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB for best performance');
        return;
      }
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Full Name is required');
      return false;
    }
    if (!formData.photo) {
      setError('Profile Photo is required');
      return false;
    }
    const size = typeof formData.tshirtSize === 'string' ? parseInt(formData.tshirtSize, 10) : formData.tshirtSize;
    if (!formData.tshirtSize || isNaN(size) || size < 10 || size > 50) {
      setError('T-shirt size must be a number between 10 and 50');
      return false;
    }
    if (!formData.dob) {
      setError('Date of Birth is required');
      return false;
    }
    const birthDate = new Date(formData.dob);
    const today = new Date();
    if (birthDate > today) {
      setError('Date of Birth cannot be in the future');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const size = typeof formData.tshirtSize === 'string' ? parseInt(formData.tshirtSize, 10) : formData.tshirtSize;
      await createPlayer(
        formData.name.trim(),
        formData.photo!,
        size,
        formData.dob
      );
      setSuccess(true);
      setFormData({
        name: '',
        photo: null,
        tshirtSize: '',
        dob: '',
      });
      setPreviewUrl(null);
      // Reset file input
      const fileInput = document.getElementById('photo') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.message || 'Failed to register player. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Player Registration</h1>
        <p className={styles.subtitle}>Register for the Cricket League Auction</p>

        {success && (
          <div className={styles.successMessage}>
            ✓ Registration successful! Your player profile has been created.
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="photo" className={styles.label}>
              Profile Photo <span className={styles.required}>*</span>
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className={styles.fileInput}
              required
            />
            {previewUrl && (
              <div className={styles.preview}>
                <img src={previewUrl} alt="Preview" className={styles.previewImage} />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tshirtSize" className={styles.label}>
              T-shirt Size <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="tshirtSize"
              name="tshirtSize"
              value={formData.tshirtSize || ''}
              onChange={handleInputChange}
              className={styles.input}
              min="10"
              max="50"
              step="1"
              placeholder="Type your size (10-50)"
              required
            />
            <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              Type any number between 10 and 50
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dob" className={styles.label}>
              Date of Birth <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className={styles.input}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerRegistration;

