import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { formatNumber } from '../data/gameData';

// Préfixe pour retrouver les sauvegardes dans le localStorage
const SAVE_PREFIX = 'beer-clicker-save-';

// Récupère tous les joueurs depuis le localStorage et les trie par cookies
function getAllPlayers() {
    const players = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(SAVE_PREFIX)) {
            const username = key.replace(SAVE_PREFIX, '');
            try {
                const data = JSON.parse(localStorage.getItem(key));
                players.push({
                    username,
                    cookies: data?.cookies ?? 0,
                    totalCookies: data?.totalCookies ?? 0,
                    role: data?.role ?? 'joueur',
                    prestigeLevel: data?.prestigeLevel ?? 0,
                });
            } catch {
                // Sauvegarde invalide, on passe
            }
        }
    }
    // Tri par totalCookies décroissant
    players.sort((a, b) => b.totalCookies - a.totalCookies);
    return players;
}

// Médailles pour le top 3
function getRankEmoji(index) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
}

function Leaderboard({ currentUser }) {
    const [showPanel, setShowPanel] = useState(false);

    // On recalcule la liste à chaque ouverture du panneau
    const players = useMemo(() => {
        if (showPanel) return getAllPlayers();
        return [];
    }, [showPanel]);

    return (
        <>
            {/* Bouton classement dans le header */}
            <button
                className="leaderboard-toggle"
                onClick={() => setShowPanel(!showPanel)}
                title="Classement"
            >
                🏆
            </button>

            {/* Modal du classement */}
            {showPanel && createPortal(
                <div className="settings-overlay" onClick={() => setShowPanel(false)}>
                    <div
                        className="settings-panel leaderboard-panel"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* En-tête */}
                        <div className="settings-header">
                            <h2>🏆 Classement</h2>
                            <button className="settings-close" onClick={() => setShowPanel(false)}>
                                ✕
                            </button>
                        </div>

                        {/* Tableau de classement */}
                        {players.length === 0 ? (
                            <p className="leaderboard-empty">
                                Aucun joueur trouvé. Commencez à jouer !
                            </p>
                        ) : (
                            <div className="leaderboard-list">
                                {players.map((player, index) => (
                                    <div
                                        key={player.username}
                                        className={`leaderboard-row ${player.username === currentUser ? 'leaderboard-current' : ''
                                            } ${index < 3 ? 'leaderboard-top' : ''}`}
                                    >
                                        <span className="leaderboard-rank">
                                            {getRankEmoji(index)}
                                        </span>
                                        <div className="leaderboard-player-info">
                                            <span className="leaderboard-name">
                                                {player.username}
                                                {player.username === currentUser && (
                                                    <span className="leaderboard-you"> (vous)</span>
                                                )}
                                            </span>
                                            <span className="leaderboard-role">
                                                {player.role === 'admin' ? '🛠️' : '🎮'}
                                            </span>
                                        </div>
                                        <div className="leaderboard-score">
                                            <span className="leaderboard-cookies">
                                                {formatNumber(player.totalCookies)} 🍺
                                            </span>
                                            {player.prestigeLevel > 0 && (
                                                <span className="leaderboard-prestige">
                                                    ⭐ {player.prestigeLevel}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default Leaderboard;
