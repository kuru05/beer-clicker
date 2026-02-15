import { PRESTIGE_THRESHOLD, PRESTIGE_BONUS, formatNumber } from '../data/gameData';

function PrestigePanel({ totalCookies, prestigeLevel, onPrestige }) {
    const canPrestige = totalCookies >= PRESTIGE_THRESHOLD;
    const nextBonus = (prestigeLevel + 1) * (PRESTIGE_BONUS * 100);
    const progress = Math.min((totalCookies / PRESTIGE_THRESHOLD) * 100, 100);

    return (
        <div className="prestige-panel">
            <h3 className="prestige-title">⭐ Prestige</h3>

            {prestigeLevel > 0 && (
                <div className="prestige-current">
                    Niveau {prestigeLevel} — Bonus : +{prestigeLevel * (PRESTIGE_BONUS * 100)}%
                </div>
            )}

            <div className="prestige-info">
                <p>
                    Réinitialisez votre progression pour un bonus permanent de production de{' '}
                    <strong>+{PRESTIGE_BONUS * 100}%</strong>.
                </p>
                <p className="prestige-requirement">
                    Requis : {formatNumber(PRESTIGE_THRESHOLD)} bières totales
                </p>
            </div>

            {!canPrestige && (
                <div className="prestige-progress">
                    <div className="evolution-bar">
                        <div
                            className="evolution-bar-fill prestige-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="prestige-progress-text">
                        {formatNumber(totalCookies)} / {formatNumber(PRESTIGE_THRESHOLD)}
                    </span>
                </div>
            )}

            <button
                className={`prestige-button ${canPrestige ? 'available' : 'disabled'}`}
                onClick={onPrestige}
                disabled={!canPrestige}
            >
                {canPrestige
                    ? `🌟 Prestigier (→ +${nextBonus}%)`
                    : `🔒 Pas encore disponible`}
            </button>
        </div>
    );
}

export default PrestigePanel;
