import { formatNumber } from '../data/gameData';

function Stats({ cookies, cookiesPerClick, prestigeLevel }) {
    return (
        <div className="stats-panel">
            <h2 className="stats-title">🍺 Brasserie</h2>

            <div className="stat-card main-stat">
                <span className="stat-value">{formatNumber(cookies)}</span>
                <span className="stat-label">Bières</span>
            </div>

            <div className="stat-grid">
                <div className="stat-card">
                    <span className="stat-icon">👆</span>
                    <span className="stat-value">{formatNumber(cookiesPerClick)}</span>
                    <span className="stat-label">par clic</span>
                </div>

                {prestigeLevel > 0 && (
                    <div className="stat-card prestige-stat">
                        <span className="stat-icon">⭐</span>
                        <span className="stat-value">{prestigeLevel}</span>
                        <span className="stat-label">Prestige (+{prestigeLevel * 5}%)</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Stats;
