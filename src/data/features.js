// ========== ACHIEVEMENTS ==========
export const ACHIEVEMENTS = [
    // Click milestones
    { id: 'first_sip', name: 'Première gorgée', description: 'Cliquez pour la première fois', icon: '🍺', condition: (s) => s.totalClicks >= 1 },
    { id: 'regular', name: 'Habitué du bar', description: '100 clics', icon: '🍻', condition: (s) => s.totalClicks >= 100 },
    { id: 'barman', name: 'Barman professionnel', description: '1 000 clics', icon: '🎯', condition: (s) => s.totalClicks >= 1000 },
    { id: 'click_legend', name: 'Légende du clic', description: '10 000 clics', icon: '🏆', condition: (s) => s.totalClicks >= 10000 },

    // Beer milestones
    { id: 'first_pint', name: 'Première pinte', description: 'Accumulez 100 bières', icon: '🥇', condition: (s) => s.totalCookies >= 100 },
    { id: 'keg', name: 'Premier fût', description: 'Accumulez 1 000 bières', icon: '🛢️', condition: (s) => s.totalCookies >= 1000 },
    { id: 'brewery_owner', name: 'Patron de brasserie', description: 'Accumulez 10 000 bières', icon: '🏭', condition: (s) => s.totalCookies >= 10000 },
    { id: 'beer_baron', name: 'Baron de la bière', description: 'Accumulez 100 000 bières', icon: '👑', condition: (s) => s.totalCookies >= 100000 },
    { id: 'beer_emperor', name: 'Empereur de la bière', description: 'Accumulez 1 000 000 bières', icon: '🌟', condition: (s) => s.totalCookies >= 1000000 },

    // Upgrade milestones
    { id: 'first_buy', name: 'Premier investissement', description: 'Achetez votre première amélioration', icon: '🛒', condition: (s) => s.totalUpgrades >= 1 },
    { id: 'collector', name: 'Collectionneur', description: 'Possédez 10 améliorations', icon: '📦', condition: (s) => s.totalUpgrades >= 10 },
    { id: 'tycoon', name: 'Magnat de la bière', description: 'Possédez 50 améliorations', icon: '💎', condition: (s) => s.totalUpgrades >= 50 },
    { id: 'empire', name: 'Empire brassicole', description: 'Possédez 100 améliorations', icon: '🏰', condition: (s) => s.totalUpgrades >= 100 },

    // Special
    { id: 'combo_5', name: 'Enchainement', description: 'Atteignez un combo x5', icon: '🔥', condition: (s) => s.maxCombo >= 5 },
    { id: 'combo_10', name: 'Frénésie', description: 'Atteignez un combo x10', icon: '💥', condition: (s) => s.maxCombo >= 10 },
    { id: 'combo_20', name: 'Rage du houblon', description: 'Atteignez un combo x20', icon: '🌋', condition: (s) => s.maxCombo >= 20 },
    { id: 'golden_catch', name: 'Bière dorée', description: 'Attrapez une bière dorée', icon: '✨', condition: (s) => s.goldenCaught >= 1 },
    { id: 'golden_hunter', name: 'Chasseur doré', description: 'Attrapez 10 bières dorées', icon: '🥇', condition: (s) => s.goldenCaught >= 10 },
    { id: 'festival_fan', name: 'Festivalier', description: 'Participez à un festival', icon: '🎪', condition: (s) => s.festivalsJoined >= 1 },
    { id: 'prestige_1', name: 'Renaissance', description: 'Effectuez votre premier prestige', icon: '⭐', condition: (s) => s.prestigeLevel >= 1 },
];

// ========== BEER FESTIVALS ==========
export const FESTIVALS = [
    {
        id: 'oktoberfest',
        name: '🎪 Oktoberfest',
        description: 'Production ×3 pendant 30 secondes !',
        multiplier: 3,
        duration: 30,
        color: '#f59e0b',
    },
    {
        id: 'stpatrick',
        name: '☘️ St. Patrick',
        description: 'Clics ×5 pendant 20 secondes !',
        clickMultiplier: 5,
        duration: 20,
        color: '#22c55e',
    },
    {
        id: 'fete_biere',
        name: '🍺 Fête de la Bière',
        description: 'Tout ×2 pendant 45 secondes !',
        multiplier: 2,
        clickMultiplier: 2,
        duration: 45,
        color: '#3b82f6',
    },
    {
        id: 'happy_hour',
        name: '🕐 Happy Hour',
        description: 'Réductions de 50% sur les achats pendant 30 secondes !',
        costReduction: 0.5,
        duration: 30,
        color: '#a855f7',
    },
];

// ========== GOLDEN BEER CONFIG ==========
export const GOLDEN_BEER = {
    minInterval: 30000,  // 30s min between spawns
    maxInterval: 120000, // 2min max
    displayDuration: 8000, // 8s to click it
    rewards: [
        { type: 'instant', label: 'Jackpot !', getValue: (cps) => Math.max(cps * 60, 100) },
        { type: 'instant', label: 'Mini bonus', getValue: (cps) => Math.max(cps * 15, 25) },
        { type: 'frenzy', label: 'Frénésie !', multiplier: 7, duration: 15 },
        { type: 'clickBoost', label: 'Doigts magiques !', multiplier: 10, duration: 20 },
    ],
};
