import { getUpgradeCost, formatNumber } from '../data/gameData';
import { useState } from 'react';

function UpgradeItem({ upgrade, cookies, onBuy, type, costReduction = 1 }) {
    const [justBought, setJustBought] = useState(false);
    const baseCost = getUpgradeCost(upgrade.baseCost, upgrade.count);
    const cost = Math.floor(baseCost * costReduction);
    const canAfford = cookies >= cost;
    const isReduced = costReduction < 1;

    const handleBuy = () => {
        if (!canAfford) return;
        onBuy(upgrade.id, type);
        setJustBought(true);
        setTimeout(() => setJustBought(false), 400);
    };

    return (
        <div
            className={`upgrade-card ${canAfford ? 'affordable' : 'locked'} ${justBought ? 'just-bought' : ''}`}
            onClick={handleBuy}
            role="button"
            tabIndex={0}
        >
            <div className="upgrade-icon">{upgrade.icon}</div>
            <div className="upgrade-info">
                <div className="upgrade-name">
                    {upgrade.name}
                    {upgrade.count > 0 && (
                        <span className="upgrade-count">×{upgrade.count}</span>
                    )}
                </div>
                <div className="upgrade-description">{upgrade.description}</div>
                <div className="upgrade-stats">
                    <span className={`upgrade-cost ${canAfford ? '' : 'too-expensive'}`}>
                        {isReduced && <s className="original-cost">🍺 {formatNumber(baseCost)}</s>}
                        🍺 {formatNumber(cost)}
                        {isReduced && <span className="discount-badge">-{Math.round((1 - costReduction) * 100)}%</span>}
                    </span>
                    <span className="upgrade-bonus">
                        +{upgrade.bonus} {type === 'upgrade' ? '/s brassées' : '/clic'}
                    </span>
                </div>
            </div>
        </div>
    );
}

function UpgradeList({ upgrades, multipliers, cookies, onBuyUpgrade, onBuyMultiplier, costReduction = 1 }) {
    const [activeTab, setActiveTab] = useState('upgrades');

    return (
        <div className="upgrade-panel">
            <div className="upgrade-tabs">
                <button
                    className={`upgrade-tab ${activeTab === 'upgrades' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upgrades')}
                >
                    🍺 Brassage
                </button>
                <button
                    className={`upgrade-tab ${activeTab === 'multipliers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('multipliers')}
                >
                    ✨ Tireuses
                </button>
            </div>

            <div className="upgrade-list">
                {activeTab === 'upgrades' &&
                    upgrades.map((upgrade) => (
                        <UpgradeItem
                            key={upgrade.id}
                            upgrade={upgrade}
                            cookies={cookies}
                            onBuy={onBuyUpgrade}
                            type="upgrade"
                            costReduction={costReduction}
                        />
                    ))}

                {activeTab === 'multipliers' &&
                    multipliers.map((mult) => (
                        <UpgradeItem
                            key={mult.id}
                            upgrade={mult}
                            cookies={cookies}
                            onBuy={onBuyMultiplier}
                            type="multiplier"
                            costReduction={costReduction}
                        />
                    ))}
            </div>
        </div>
    );
}

export default UpgradeList;
