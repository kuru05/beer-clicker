import { useState } from 'react';
import { createPortal } from 'react-dom';
import { formatNumber } from '../data/gameData';

function SettingsPanel({ gameStats, onResetSave, onExportSave, onImportSave }) {
    const [showPanel, setShowPanel] = useState(false);
    const [importText, setImportText] = useState('');
    const [confirmReset, setConfirmReset] = useState(false);

    // Copie la sauvegarde encodée dans le presse-papier
    const handleExport = () => {
        const data = onExportSave();
        navigator.clipboard.writeText(data).then(() => {
            alert('Sauvegarde copiée dans le presse-papier !');
        }).catch(() => {
            // Si le clipboard ne marche pas, on propose un prompt classique
            prompt('Copiez cette sauvegarde :', data);
        });
    };

    // Importe une sauvegarde depuis le texte collé par l'utilisateur
    const handleImport = () => {
        if (!importText.trim()) return;
        try {
            onImportSave(importText.trim());
            setImportText('');
            setShowPanel(false);
            alert('Sauvegarde importée avec succès !');
        } catch {
            alert('Erreur : sauvegarde invalide');
        }
    };

    // Double-clic pour confirmer le reset (sécurité)
    const handleReset = () => {
        if (!confirmReset) {
            setConfirmReset(true);
            // On annule la confirmation après 3 secondes si le joueur ne re-clique pas
            setTimeout(() => setConfirmReset(false), 3000);
            return;
        }
        onResetSave();
        setConfirmReset(false);
        setShowPanel(false);
    };

    // Formate les secondes en heures/minutes/secondes lisibles
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}h ${m}m ${s}s`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    return (
        <>
            {/* Bouton engrenage dans le header */}
            <button
                className="settings-toggle"
                onClick={() => setShowPanel(!showPanel)}
                title="Paramètres"
            >
                ⚙️
            </button>

            {/* 
                createPortal : on rend l'overlay directement dans le body 
                pour éviter les problèmes de positionnement liés au 
                backdrop-filter du header parent 
            */}
            {showPanel && createPortal(
                <div className="settings-overlay" onClick={() => setShowPanel(false)}>
                    <div className="settings-panel" onClick={(e) => e.stopPropagation()}>

                        {/* En-tête du panneau */}
                        <div className="settings-header">
                            <h2>⚙️ Paramètres</h2>
                            <button className="settings-close" onClick={() => setShowPanel(false)}>
                                ✕
                            </button>
                        </div>

                        {/* Section statistiques */}
                        <div className="settings-section">
                            <h3>📊 Statistiques détaillées</h3>
                            <div className="settings-stats-grid">
                                <div className="settings-stat">
                                    <span className="settings-stat-label">Clics totaux</span>
                                    <span className="settings-stat-value">{formatNumber(gameStats.totalClicks)}</span>
                                </div>
                                <div className="settings-stat">
                                    <span className="settings-stat-label">Bières totales brassées</span>
                                    <span className="settings-stat-value">{formatNumber(gameStats.totalCookies)}</span>
                                </div>
                                <div className="settings-stat">
                                    <span className="settings-stat-label">Bières dorées attrapées</span>
                                    <span className="settings-stat-value">{gameStats.goldenCaught}</span>
                                </div>
                                <div className="settings-stat">
                                    <span className="settings-stat-label">Meilleur combo</span>
                                    <span className="settings-stat-value">×{gameStats.maxCombo}</span>
                                </div>
                                <div className="settings-stat">
                                    <span className="settings-stat-label">Festivals vécus</span>
                                    <span className="settings-stat-value">{gameStats.festivalsJoined}</span>
                                </div>
                                <div className="settings-stat">
                                    <span className="settings-stat-label">Temps de jeu</span>
                                    <span className="settings-stat-value">{formatTime(gameStats.playTime)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section export / import de sauvegarde */}
                        <div className="settings-section">
                            <h3>💾 Sauvegarde</h3>
                            <button className="settings-btn export-btn" onClick={handleExport}>
                                📤 Exporter la sauvegarde
                            </button>
                            <div className="import-area">
                                <textarea
                                    className="import-textarea"
                                    placeholder="Collez votre sauvegarde ici..."
                                    value={importText}
                                    onChange={(e) => setImportText(e.target.value)}
                                />
                                <button className="settings-btn import-btn" onClick={handleImport}>
                                    📥 Importer
                                </button>
                            </div>
                        </div>

                        {/* Section raccourcis clavier */}
                        <div className="settings-section">
                            <h3>⌨️ Raccourcis clavier</h3>
                            <div className="shortcuts-list">
                                <div className="shortcut"><kbd>Espace</kbd> Brasser une bière</div>
                                <div className="shortcut"><kbd>1-8</kbd> Acheter l'amélioration N°</div>
                                <div className="shortcut"><kbd>S</kbd> Ouvrir les paramètres</div>
                                <div className="shortcut"><kbd>A</kbd> Ouvrir les succès</div>
                                <div className="shortcut"><kbd>Échap</kbd> Fermer le panneau</div>
                            </div>
                        </div>

                        {/* Zone de danger : reset de la partie */}
                        <div className="settings-section danger-zone">
                            <h3>⚠️ Zone de danger</h3>
                            <button
                                className={`settings-btn reset-btn ${confirmReset ? 'confirm' : ''}`}
                                onClick={handleReset}
                            >
                                {confirmReset
                                    ? '⚠️ Cliquez encore pour confirmer !'
                                    : '🗑️ Réinitialiser la partie'}
                            </button>
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default SettingsPanel;
