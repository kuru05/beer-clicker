import { useState } from 'react';
import { createPortal } from 'react-dom';
import { formatNumber } from '../data/gameData';

// Préfixe pour les clés de sauvegarde
const SAVE_PREFIX = 'beer-clicker-save-';

// Boutons d'ajout rapide avec des montants prédéfinis
const PRESETS = [
    { label: '+100', value: 100 },
    { label: '+1K', value: 1_000 },
    { label: '+10K', value: 10_000 },
    { label: '+100K', value: 100_000 },
    { label: '+1M', value: 1_000_000 },
    { label: '+1B', value: 1_000_000_000 },
];

function AdminPanel({ cookies, setCookies, setTotalCookies, allPlayers, currentUser }) {
    const [showPanel, setShowPanel] = useState(false);
    const [customAmount, setCustomAmount] = useState('');
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [editAmount, setEditAmount] = useState('');

    // Ajoute un montant au compteur actuel
    const addCookies = (amount) => {
        setCookies((prev) => prev + amount);
        setTotalCookies((prev) => prev + amount);
    };

    // Définit le compteur à un montant exact
    const setCookiesExact = (amount) => {
        setCookies(amount);
        setTotalCookies((prev) => Math.max(prev, amount));
    };

    // Gère l'ajout d'un montant personnalisé
    const handleCustomAdd = () => {
        const amount = parseInt(customAmount, 10);
        if (!isNaN(amount) && amount > 0) {
            addCookies(amount);
            setCustomAmount('');
        }
    };

    // Gère le set exact d'un montant personnalisé
    const handleCustomSet = () => {
        const amount = parseInt(customAmount, 10);
        if (!isNaN(amount) && amount >= 0) {
            setCookiesExact(amount);
            setCustomAmount('');
        }
    };

    // Permet de valider avec Entrée dans l'input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCustomAdd();
        }
    };

    // === Gestion des joueurs (admin) ===

    // Reset le score d'un joueur dans le localStorage
    const handleResetPlayer = (username) => {
        if (username === currentUser) {
            // Si c'est le joueur actuel, on reset directement son state
            setCookies(0);
            setTotalCookies(0);
            return;
        }
        // Sinon on modifie directement dans le localStorage
        try {
            const key = SAVE_PREFIX + username;
            const data = JSON.parse(localStorage.getItem(key));
            if (data) {
                data.cookies = 0;
                data.totalCookies = 0;
                localStorage.setItem(key, JSON.stringify(data));
            }
        } catch {
            console.warn('Erreur lors du reset du joueur', username);
        }
    };

    // Modifier les cookies d'un joueur
    const handleSetPlayerCookies = (username) => {
        const amount = parseInt(editAmount, 10);
        if (isNaN(amount) || amount < 0) return;

        if (username === currentUser) {
            setCookiesExact(amount);
        } else {
            try {
                const key = SAVE_PREFIX + username;
                const data = JSON.parse(localStorage.getItem(key));
                if (data) {
                    data.cookies = amount;
                    data.totalCookies = Math.max(data.totalCookies ?? 0, amount);
                    localStorage.setItem(key, JSON.stringify(data));
                }
            } catch {
                console.warn('Erreur lors de la modification du joueur', username);
            }
        }
        setEditingPlayer(null);
        setEditAmount('');
    };

    // Supprimer la sauvegarde d'un joueur
    const handleDeletePlayer = (username) => {
        if (username === currentUser) return; // On ne supprime pas sa propre sauvegarde ici
        localStorage.removeItem(SAVE_PREFIX + username);
    };

    // Liste des autres joueurs (pour la gestion admin)
    const otherPlayers = allPlayers || [];

    return (
        <>
            {/* Bouton admin dans le header */}
            <button
                className="admin-toggle"
                onClick={() => setShowPanel(!showPanel)}
                title="Admin Panel"
            >
                🛠️
            </button>

            {/* 
                createPortal : même logique que pour les succès et paramètres,
                on rend la modale dans le body pour qu'elle soit bien centrée
            */}
            {showPanel && createPortal(
                <div className="settings-overlay" onClick={() => setShowPanel(false)}>
                    <div
                        className="settings-panel admin-panel-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* En-tête */}
                        <div className="settings-header">
                            <h2>🛠️ Admin Panel</h2>
                            <button className="settings-close" onClick={() => setShowPanel(false)}>
                                ✕
                            </button>
                        </div>

                        {/* Affichage du nombre de cookies actuel */}
                        <div className="admin-current">
                            <span className="admin-current-label">Cookies actuels</span>
                            <span className="admin-current-value">
                                {formatNumber(Math.floor(cookies))} 🍺
                            </span>
                        </div>

                        {/* Boutons d'ajout rapide */}
                        <div className="settings-section">
                            <h3>⚡ Ajout rapide</h3>
                            <div className="admin-presets">
                                {PRESETS.map((preset) => (
                                    <button
                                        key={preset.value}
                                        className="admin-preset-btn"
                                        onClick={() => addCookies(preset.value)}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Montant personnalisé */}
                        <div className="settings-section">
                            <h3>🎯 Montant personnalisé</h3>
                            <div className="admin-custom">
                                <input
                                    type="number"
                                    className="admin-input"
                                    placeholder="Entrez un montant..."
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    min="0"
                                />
                                <div className="admin-custom-buttons">
                                    <button className="admin-action-btn admin-add-btn" onClick={handleCustomAdd}>
                                        ➕ Ajouter
                                    </button>
                                    <button className="admin-action-btn admin-set-btn" onClick={handleCustomSet}>
                                        📌 Set exact
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Gestion des joueurs */}
                        <div className="settings-section">
                            <h3>👥 Gestion des joueurs</h3>
                            {otherPlayers.length === 0 ? (
                                <p className="admin-no-players">Aucun joueur trouvé.</p>
                            ) : (
                                <div className="admin-players-list">
                                    {otherPlayers.map((player) => (
                                        <div
                                            key={player.username}
                                            className={`admin-player-row ${player.username === currentUser ? 'admin-player-current' : ''
                                                }`}
                                        >
                                            <div className="admin-player-info">
                                                <span className="admin-player-name">
                                                    {player.username}
                                                    {player.username === currentUser && ' (vous)'}
                                                </span>
                                                <span className="admin-player-score">
                                                    {formatNumber(player.cookies)} 🍺
                                                </span>
                                            </div>

                                            {/* Boutons admin pour ce joueur */}
                                            {editingPlayer === player.username ? (
                                                <div className="admin-player-edit">
                                                    <input
                                                        type="number"
                                                        className="admin-input admin-player-input"
                                                        placeholder="Nouveau montant..."
                                                        value={editAmount}
                                                        onChange={(e) => setEditAmount(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSetPlayerCookies(player.username);
                                                        }}
                                                        min="0"
                                                        autoFocus
                                                    />
                                                    <button
                                                        className="admin-action-btn admin-add-btn"
                                                        onClick={() => handleSetPlayerCookies(player.username)}
                                                    >
                                                        ✅
                                                    </button>
                                                    <button
                                                        className="admin-action-btn"
                                                        onClick={() => { setEditingPlayer(null); setEditAmount(''); }}
                                                    >
                                                        ❌
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="admin-player-actions">
                                                    <button
                                                        className="admin-action-btn admin-set-btn"
                                                        onClick={() => { setEditingPlayer(player.username); setEditAmount(''); }}
                                                        title="Modifier le score"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="admin-action-btn admin-reset-btn"
                                                        onClick={() => handleResetPlayer(player.username)}
                                                        title="Remettre à 0"
                                                    >
                                                        🔄
                                                    </button>
                                                    {player.username !== currentUser && (
                                                        <button
                                                            className="admin-action-btn admin-reset-btn"
                                                            onClick={() => handleDeletePlayer(player.username)}
                                                            title="Supprimer la sauvegarde"
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Raccourcis : reset et max */}
                        <div className="settings-section">
                            <h3>🔄 Raccourcis</h3>
                            <div className="admin-shortcuts">
                                <button
                                    className="admin-action-btn admin-reset-btn"
                                    onClick={() => setCookiesExact(0)}
                                >
                                    🗑️ Reset à 0
                                </button>
                                <button
                                    className="admin-action-btn admin-max-btn"
                                    onClick={() => addCookies(999_999_999_999)}
                                >
                                    💰 Max cookies
                                </button>
                            </div>
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default AdminPanel;
