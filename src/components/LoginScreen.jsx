import { useState } from 'react';

// Préfixe utilisé pour trouver les sauvegardes dans le localStorage
const SAVE_PREFIX = 'beer-clicker-save-';
// Mot de passe admin (simple, en dur pour le projet)
const ADMIN_PASSWORD = 'admin123';
// Nom du compte admin par défaut
const DEFAULT_ADMIN = 'admin';

// Crée le compte admin par défaut s'il n'existe pas encore
function seedDefaultAdmin() {
    const adminKey = SAVE_PREFIX + DEFAULT_ADMIN;
    if (!localStorage.getItem(adminKey)) {
        const defaultSave = {
            cookies: 0,
            totalCookies: 0,
            totalClicks: 0,
            role: 'admin',
            upgrades: [],
            multipliers: [],
            prestigeLevel: 0,
            achievements: [],
        };
        localStorage.setItem(adminKey, JSON.stringify(defaultSave));
    }
}

// Récupère la liste des joueurs sauvegardés dans le localStorage
function getSavedPlayers() {
    // S'assurer que le compte admin par défaut existe
    seedDefaultAdmin();

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
                });
            } catch {
                // Sauvegarde corrompue, on l'ignore
            }
        }
    }
    return players;
}

function LoginScreen({ onLogin }) {
    const [username, setUsername] = useState('');
    const [wantAdmin, setWantAdmin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [savedPlayers] = useState(getSavedPlayers);

    // Valide le formulaire et lance la connexion
    const handleNewGame = () => {
        const trimmed = username.trim();
        if (!trimmed) {
            setErrorMessage('Veuillez entrer un nom d\'utilisateur.');
            return;
        }

        // Vérification du mot de passe admin si demandé
        let role = 'joueur';
        if (wantAdmin) {
            if (adminPassword !== ADMIN_PASSWORD) {
                setErrorMessage('Mot de passe admin incorrect.');
                return;
            }
            role = 'admin';
        }

        setErrorMessage('');
        onLogin(trimmed, role);
    };

    // Charger une partie existante
    const handleLoadGame = (player) => {
        onLogin(player.username, player.role);
    };

    // Soumettre avec Entrée
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleNewGame();
        }
    };

    return (
        <div className="login-screen">
            <div className="login-card">
                <h1 className="login-title">🍺 Beer Clicker</h1>
                <p className="login-subtitle">Connectez-vous pour commencer à brasser !</p>

                {/* Formulaire principal */}
                <div className="login-form">
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Votre nom d'utilisateur..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        maxLength={20}
                    />

                    {/* Toggle rôle admin */}
                    <div className="login-role-toggle">
                        <label className="login-role-label">
                            <input
                                type="checkbox"
                                checked={wantAdmin}
                                onChange={(e) => setWantAdmin(e.target.checked)}
                            />
                            <span className="login-role-text">
                                Mode Admin 🛠️
                            </span>
                        </label>
                    </div>

                    {/* Champ mot de passe admin (visible si toggle activé) */}
                    {wantAdmin && (
                        <input
                            type="password"
                            className="login-input login-password"
                            placeholder="Mot de passe admin..."
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    )}

                    {/* Message d'erreur */}
                    {errorMessage && (
                        <div className="login-error">{errorMessage}</div>
                    )}

                    <button className="login-btn login-btn-primary" onClick={handleNewGame}>
                        🎮 Jouer
                    </button>
                </div>

                {/* Liste des parties sauvegardées */}
                {savedPlayers.length > 0 && (
                    <div className="login-saved-section">
                        <h3 className="login-saved-title">📂 Parties sauvegardées</h3>
                        <div className="login-saved-list">
                            {savedPlayers.map((player) => (
                                <div
                                    key={player.username}
                                    className="login-saved-item"
                                    onClick={() => handleLoadGame(player)}
                                >
                                    <div className="login-saved-info">
                                        <span className="login-saved-name">
                                            {player.username}
                                        </span>
                                        <span className="login-saved-role">
                                            {player.role === 'admin' ? '🛠️ Admin' : '🎮 Joueur'}
                                        </span>
                                    </div>
                                    <span className="login-saved-cookies">
                                        {Math.floor(player.cookies).toLocaleString()} 🍺
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginScreen;
