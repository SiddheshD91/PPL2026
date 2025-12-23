import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../services/authService';
import {
  getAllPlayers,
  getPlayerById,
} from '../../services/playerService';
import {
  getAllCategories,
  createCategory,
  addPlayerToCategory,
  removePlayerFromCategory,
  deleteCategory,
} from '../../services/categoryService';
import type { Player, Category } from '../../types';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = players.filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers([]);
    }
  }, [searchTerm, players]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [playersData, categoriesData] = await Promise.all([
        getAllPlayers(),
        getAllCategories(),
      ]);
      setPlayers(playersData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePlayerClick = async (playerId: string) => {
    try {
      const player = await getPlayerById(playerId);
      setSelectedPlayer(player);
    } catch (err: any) {
      setError(err.message || 'Failed to load player details');
    }
  };

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setError(null);
    try {
      await createCategory(newCategoryName.trim());
      setSuccess('Category created successfully');
      setNewCategoryName('');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    }
  };

  const handleAddPlayerToCategory = async (
    categoryId: string,
    playerId: string
  ) => {
    setError(null);
    try {
      await addPlayerToCategory(categoryId, playerId);
      setSuccess('Player added to category successfully');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add player to category');
    }
  };

  const handleRemovePlayerFromCategory = async (
    categoryId: string,
    playerId: string
  ) => {
    setError(null);
    try {
      await removePlayerFromCategory(categoryId, playerId);
      setSuccess('Player removed from category successfully');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to remove player from category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    setError(null);
    try {
      await deleteCategory(categoryId);
      setSuccess('Category deleted successfully');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      {error && (
        <div className={styles.errorMessage} onClick={() => setError(null)}>
          {error} (Click to dismiss)
        </div>
      )}

      {success && (
        <div className={styles.successMessage} onClick={() => setSuccess(null)}>
          {success} (Click to dismiss)
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Search Players</h2>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
            {searchTerm && (
              <div className={styles.searchResults}>
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={styles.playerCard}
                      onClick={() => handlePlayerClick(player.id)}
                    >
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className={styles.playerThumbnail}
                      />
                      <div className={styles.playerInfo}>
                        <div className={styles.playerName}>{player.name}</div>
                        <div className={styles.playerDetails}>
                          Age: {player.age} | Size: {player.tshirtSize}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults}>No players found</div>
                )}
              </div>
            )}
          </section>

          {selectedPlayer && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Player Details</h2>
              <div className={styles.playerDetailCard}>
                <img
                  src={selectedPlayer.photoUrl}
                  alt={selectedPlayer.name}
                  className={styles.playerDetailPhoto}
                />
                <div className={styles.playerDetailInfo}>
                  <h3>{selectedPlayer.name}</h3>
                  <p>
                    <strong>Age:</strong> {selectedPlayer.age}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{' '}
                    {new Date(selectedPlayer.dob).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>T-shirt Size:</strong> {selectedPlayer.tshirtSize}
                  </p>
                  <p>
                    <strong>Registered:</strong>{' '}
                    {new Date(selectedPlayer.createdAt).toLocaleDateString()}
                  </p>
                  <div className={styles.playerDetailActions}>
                    <Link to={`/admin/players/${selectedPlayer.id}`} className={styles.linkButton}>
                      View page
                    </Link>
                    <Link to={`/admin/players/${selectedPlayer.id}/edit`} className={styles.primaryButton}>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className={styles.rightPanel}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Create Category</h2>
            <form onSubmit={handleCreateCategory} className={styles.categoryForm}>
              <input
                type="text"
                placeholder="Category name (e.g., A1 Batsman)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={styles.categoryInput}
              />
              <button type="submit" className={styles.createButton}>
                Create
              </button>
            </form>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Categories</h2>
            {categories.length === 0 ? (
              <div className={styles.noCategories}>No categories yet</div>
            ) : (
              <div className={styles.categoriesList}>
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    players={players}
                    onAddPlayer={handleAddPlayerToCategory}
                    onRemovePlayer={handleRemovePlayerFromCategory}
                    onDeleteCategory={handleDeleteCategory}
                    getPlayerById={getPlayerById}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

interface CategoryCardProps {
  category: Category;
  players: Player[];
  onAddPlayer: (categoryId: string, playerId: string) => void;
  onRemovePlayer: (categoryId: string, playerId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  getPlayerById: (playerId: string) => Promise<Player | null>;
}

const CategoryCard = ({
  category,
  players,
  onAddPlayer,
  onRemovePlayer,
  onDeleteCategory,
  getPlayerById,
}: CategoryCardProps) => {
  const [categoryPlayers, setCategoryPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategoryPlayers();
  }, [category.players]);

  const loadCategoryPlayers = async () => {
    setLoadingPlayers(true);
    try {
      const playerPromises = category.players.map((playerId) =>
        getPlayerById(playerId)
      );
      const loadedPlayers = await Promise.all(playerPromises);
      setCategoryPlayers(
        loadedPlayers.filter((p) => p !== null) as Player[]
      );
    } catch (error) {
      console.error('Failed to load category players:', error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const availablePlayers = players.filter(
    (p) => !category.players.includes(p.id)
  );

  const filteredAvailablePlayers = availablePlayers.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canAddMore = category.players.length < 8;

  return (
    <div className={styles.categoryCard}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryName}>{category.name}</h3>
        <div className={styles.categoryActions}>
          <Link to={`/admin/categories/${category.id}`} className={styles.linkButton}>
            View
          </Link>
          <span className={styles.playerCount}>
            {category.players.length}/8
          </span>
          <button
            onClick={() => onDeleteCategory(category.id)}
            className={styles.deleteCategoryButton}
            title="Delete category"
          >
            🗑️
          </button>
        </div>
      </div>

      {loadingPlayers ? (
        <div className={styles.loadingPlayers}>Loading players...</div>
      ) : (
        <>
          {categoryPlayers.length > 0 ? (
            <div className={styles.categoryPlayersList}>
              {categoryPlayers.map((player) => (
                <div key={player.id} className={styles.categoryPlayerItem}>
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className={styles.categoryPlayerThumbnail}
                  />
                  <span className={styles.categoryPlayerName}>{player.name}</span>
                  <button
                    onClick={() => onRemovePlayer(category.id, player.id)}
                    className={styles.removePlayerButton}
                    title="Remove player"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noPlayersInCategory}>No players in this category</div>
          )}

          {canAddMore && (
            <div className={styles.addPlayerSection}>
              {!showAddPlayer ? (
                <button
                  onClick={() => setShowAddPlayer(true)}
                  className={styles.addPlayerButton}
                >
                  + Add Player
                </button>
              ) : (
                <div className={styles.addPlayerForm}>
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.addPlayerSearch}
                  />
                  <div className={styles.addPlayerResults}>
                    {filteredAvailablePlayers.length > 0 ? (
                      filteredAvailablePlayers.map((player) => (
                        <div
                          key={player.id}
                          className={styles.addPlayerOption}
                          onClick={() => {
                            onAddPlayer(category.id, player.id);
                            setShowAddPlayer(false);
                            setSearchTerm('');
                          }}
                        >
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className={styles.addPlayerThumbnail}
                          />
                          <span>{player.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noResults}>No players found</div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowAddPlayer(false);
                      setSearchTerm('');
                    }}
                    className={styles.cancelAddButton}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {!canAddMore && (
            <div className={styles.maxPlayersReached}>
              Maximum 8 players reached
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

