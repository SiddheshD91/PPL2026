import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlayerById } from '../../services/playerService';
import type { Player } from '../../types';
import styles from './PlayerDetailPage.module.css';

const PlayerDetailPage = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!playerId) return;
      try {
        const data = await getPlayerById(playerId);
        if (!data) {
          setError('Player not found');
        } else {
          setPlayer(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load player');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [playerId]);

  if (loading) {
    return <div className={styles.page}>Loading player...</div>;
  }

  if (error || !player) {
    return <div className={styles.page}>{error || 'Player not found'}</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.name}>{player.name}</h1>
          <div className={styles.actions}>
            <Link to="/admin/dashboard" className={styles.linkButton}>Back</Link>
            <Link to={`/admin/players/${player.id}/edit`} className={styles.primaryButton}>Edit</Link>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.photoWrapper}>
            <img src={player.photoUrl} alt={player.name} className={styles.photo} />
          </div>
          <div className={styles.info}>
            <div className={styles.row}>
              <span>T-shirt Size:</span>
              <strong>{player.tshirtSize}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;

