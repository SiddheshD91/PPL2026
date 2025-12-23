import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryById } from '../../services/categoryService';
import { getPlayerById } from '../../services/playerService';
import type { Category, Player } from '../../types';
import styles from './CategoryDetailPage.module.css';

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!categoryId) return;
      try {
        const cat = await getCategoryById(categoryId);
        if (!cat) {
          setError('Category not found');
          setLoading(false);
          return;
        }
        setCategory(cat);

        const playerPromises = cat.players.map((pid) => getPlayerById(pid));
        const loaded = await Promise.all(playerPromises);
        setPlayers(loaded.filter((p): p is Player => p !== null));
      } catch (err: any) {
        setError(err.message || 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryId]);

  if (loading) return <div className={styles.page}>Loading category...</div>;
  if (error || !category) return <div className={styles.page}>{error || 'Category not found'}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{category.name}</h1>
          <div className={styles.actions}>
            <Link to="/admin/dashboard" className={styles.linkButton}>Back</Link>
          </div>
        </div>
        <div className={styles.count}>{players.length}/8 players</div>
        <div className={styles.grid}>
          {players.length === 0 && <div className={styles.empty}>No players in this category</div>}
          {players.map((player) => (
            <Link to={`/admin/players/${player.id}`} key={player.id} className={styles.playerCard}>
              <img src={player.photoUrl} alt={player.name} className={styles.playerPhoto} />
              <div className={styles.playerInfo}>
                <div className={styles.playerName}>{player.name}</div>
                <div className={styles.playerMeta}>Age: {player.age} • Size: {player.tshirtSize}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage;

