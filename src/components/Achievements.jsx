import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ACHIEVEMENTS } from '../data/features';

function Achievements({ gameStats, unlockedIds, onNewAchievement }) {
    const [showPanel, setShowPanel] = useState(false);

    // On vérifie à chaque changement de stats si un nouveau succès est débloqué
    useEffect(() => {
        ACHIEVEMENTS.forEach((ach) => {
            if (!unlockedIds.includes(ach.id) && ach.condition(gameStats)) {
                onNewAchievement(ach);
            }
        });
    }, [gameStats, unlockedIds, onNewAchievement]);

    // Calcul du pourcentage de progression (mémoïsé pour éviter les re-calculs inutiles)
    const progress = useMemo(() => {
        return Math.round((unlockedIds.length / ACHIEVEMENTS.length) * 100);
    }, [unlockedIds]);

    return (
        <>
            {/* Bouton dans le header pour ouvrir le panneau */}
            <button
                className="achievements-toggle"
                onClick={() => setShowPanel(!showPanel)}
                title="Succès"
            >
                🏆 {unlockedIds.length}/{ACHIEVEMENTS.length}
            </button>

            {/* 
                On utilise createPortal pour afficher l'overlay dans le body
                et pas dans le header (sinon le backdrop-filter du header 
                empêche le position: fixed de fonctionner correctement)
            */}
            {showPanel && createPortal(
                <div className="achievements-overlay" onClick={() => setShowPanel(false)}>
                    {/* stopPropagation pour ne pas fermer quand on clique dans le panneau */}
                    <div className="achievements-panel" onClick={(e) => e.stopPropagation()}>

                        {/* En-tête avec titre, barre de progression et bouton fermer */}
                        <div className="achievements-header">
                            <h2>🏆 Succès</h2>
                            <div className="achievements-progress-bar">
                                <div
                                    className="achievements-progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="achievements-progress-text">
                                {unlockedIds.length}/{ACHIEVEMENTS.length} ({progress}%)
                            </span>
                            <button className="achievements-close" onClick={() => setShowPanel(false)}>
                                ✕
                            </button>
                        </div>

                        {/* Grille des succès */}
                        <div className="achievements-grid">
                            {ACHIEVEMENTS.map((ach) => {
                                const unlocked = unlockedIds.includes(ach.id);
                                return (
                                    <div
                                        key={ach.id}
                                        className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
                                        title={ach.description}
                                    >
                                        <span className="achievement-icon">
                                            {unlocked ? ach.icon : '🔒'}
                                        </span>
                                        <div className="achievement-info">
                                            <span className="achievement-name">
                                                {unlocked ? ach.name : '???'}
                                            </span>
                                            <span className="achievement-desc">
                                                {unlocked ? ach.description : 'Succès verrouillé'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default Achievements;
