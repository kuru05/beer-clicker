import { useState, useEffect, useCallback, useRef } from 'react';
import CookieButton from '../components/CookieButton';
import Stats from '../components/Stats';
import UpgradeList from '../components/UpgradeList';
import PrestigePanel from '../components/PrestigePanel';
import Achievements from '../components/Achievements';
import GoldenBeer from '../components/GoldenBeer';
import SettingsPanel from '../components/SettingsPanel';
import AdminPanel from '../components/AdminPanel';
import FestivalEvent from '../components/FestivalEvent';
import BubbleBackground from '../components/BubbleBackground';
import LoginScreen from '../components/LoginScreen';
import Leaderboard from '../components/Leaderboard';
import {
  INITIAL_UPGRADES,
  INITIAL_MULTIPLIERS,
  getUpgradeCost,
  PRESTIGE_THRESHOLD,
  PRESTIGE_BONUS,
} from '../data/gameData';
import '../assets/styles/App.css';

// Préfixe pour les clés de sauvegarde dans le localStorage
const SAVE_PREFIX = 'beer-clicker-save-';

const DEFAULT_STATS = {
  totalClicks: 0,
  totalCookies: 0,
  goldenCaught: 0,
  maxCombo: 0,
  festivalsJoined: 0,
  playTime: 0,
  prestigeLevel: 0,
  lastSaveTime: Date.now(),
};

// Charge la sauvegarde d'un utilisateur donné
function loadGame(username) {
  try {
    const saved = localStorage.getItem(SAVE_PREFIX + username);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Erreur de chargement de la sauvegarde:', e);
  }
  return null;
}

// Récupère la liste de tous les joueurs sauvegardés
function getAllPlayers() {
  const players = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(SAVE_PREFIX)) {
      const name = key.replace(SAVE_PREFIX, '');
      try {
        const data = JSON.parse(localStorage.getItem(key));
        players.push({
          username: name,
          cookies: data?.cookies ?? 0,
          totalCookies: data?.totalCookies ?? 0,
          role: data?.role ?? 'joueur',
        });
      } catch {
        // Sauvegarde corrompue
      }
    }
  }
  return players;
}

function App() {
  // === État de l'utilisateur connecté ===
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('joueur');

  // === Fonction de connexion ===
  const handleLogin = useCallback((username, role) => {
    setCurrentUser(username);
    setUserRole(role);
  }, []);

  // === Fonction de déconnexion ===
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setUserRole('joueur');
  }, []);

  // Si pas connecté, on affiche l'écran de login
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Sinon, on affiche le jeu
  return (
    <GameScreen
      currentUser={currentUser}
      userRole={userRole}
      onLogout={handleLogout}
    />
  );
}

// Composant principal du jeu (séparé pour avoir un state propre à chaque session)
function GameScreen({ currentUser, userRole, onLogout }) {
  const savedGame = loadGame(currentUser);

  // Core state
  const [cookies, setCookies] = useState(savedGame?.cookies ?? 0);
  const [totalCookies, setTotalCookies] = useState(savedGame?.totalCookies ?? 0);
  const [upgrades, setUpgrades] = useState(
    savedGame?.upgrades ?? INITIAL_UPGRADES.map((u) => ({ ...u }))
  );
  const [multipliers, setMultipliers] = useState(
    savedGame?.multipliers ?? INITIAL_MULTIPLIERS.map((m) => ({ ...m }))
  );
  const [prestigeLevel, setPrestigeLevel] = useState(savedGame?.prestigeLevel ?? 0);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // New feature state
  const [unlockedAchievements, setUnlockedAchievements] = useState(
    savedGame?.unlockedAchievements ?? []
  );
  const [gameStats, setGameStats] = useState(savedGame?.gameStats ?? { ...DEFAULT_STATS });

  // Combo system
  const [comboCount, setComboCount] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const comboTimeoutRef = useRef(null);

  // Active effects (from golden beer / festivals)
  const [activeEffects, setActiveEffects] = useState([]);

  // Offline earnings
  const [offlineEarnings, setOfflineEarnings] = useState(null);

  // Calculate derived values
  const productionAuto = upgrades.reduce((sum, u) => sum + u.bonus * u.count, 0);
  const prestigeMultiplier = 1 + prestigeLevel * PRESTIGE_BONUS;

  // Factor in active effects
  const productionEffectMultiplier = activeEffects.reduce((mult, effect) => {
    if (effect.type === 'frenzy' || (effect.type === 'festival' && effect.multiplier)) {
      return mult * effect.multiplier;
    }
    return mult;
  }, 1);

  const clickEffectMultiplier = activeEffects.reduce((mult, effect) => {
    if (effect.type === 'clickBoost' || (effect.type === 'festival' && effect.clickMultiplier)) {
      return mult * (effect.clickMultiplier || effect.multiplier);
    }
    return mult;
  }, 1);

  const costEffectReduction = activeEffects.reduce((red, effect) => {
    if (effect.type === 'festival' && effect.costReduction) {
      return red * effect.costReduction;
    }
    return red;
  }, 1);

  const cookiesPerSecond = productionAuto * prestigeMultiplier * productionEffectMultiplier;
  const baseCookiesPerClick =
    (1 + multipliers.reduce((sum, m) => sum + m.bonus * m.count, 0)) * prestigeMultiplier;
  const cookiesPerClick = baseCookiesPerClick * clickEffectMultiplier * comboMultiplier;

  // Play time tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setGameStats((prev) => ({ ...prev, playTime: prev.playTime + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Offline earnings calculation on mount
  useEffect(() => {
    if (savedGame?.gameStats?.lastSaveTime && cookiesPerSecond > 0) {
      const elapsed = (Date.now() - savedGame.gameStats.lastSaveTime) / 1000;
      if (elapsed > 10) { // Only show if away > 10 seconds
        const earned = Math.floor(cookiesPerSecond * elapsed * 0.5); // 50% efficiency offline
        if (earned > 0) {
          setOfflineEarnings(earned);
          setCookies((prev) => prev + earned);
          setTotalCookies((prev) => prev + earned);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Active effects countdown
  useEffect(() => {
    if (activeEffects.length === 0) return;

    const interval = setInterval(() => {
      setActiveEffects((prev) =>
        prev
          .map((e) => ({ ...e, timeLeft: e.timeLeft - 1 }))
          .filter((e) => e.timeLeft > 0)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEffects.length]);

  // Auto-production interval
  useEffect(() => {
    if (cookiesPerSecond <= 0) return;

    const interval = setInterval(() => {
      setCookies((prev) => prev + cookiesPerSecond);
      setTotalCookies((prev) => prev + cookiesPerSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [cookiesPerSecond]);

  // Sauvegarde dans le localStorage (clé unique par utilisateur)
  useEffect(() => {
    const saveData = {
      cookies,
      totalCookies,
      upgrades,
      multipliers,
      prestigeLevel,
      unlockedAchievements,
      gameStats: { ...gameStats, lastSaveTime: Date.now() },
      role: userRole,
    };
    localStorage.setItem(SAVE_PREFIX + currentUser, JSON.stringify(saveData));
  }, [cookies, totalCookies, upgrades, multipliers, prestigeLevel, unlockedAchievements, gameStats, currentUser, userRole]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleClick();
      }
      if (e.key >= '1' && e.key <= '8') {
        const idx = parseInt(e.key) - 1;
        if (upgrades[idx]) {
          handleBuyUpgrade(upgrades[idx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Show feedback message
  const showFeedback = useCallback((msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(''), 2500);
  }, []);

  // Manual click with combo
  const handleClick = useCallback(() => {
    const earned = cookiesPerClick;
    setCookies((prev) => prev + earned);
    setTotalCookies((prev) => prev + earned);
    setGameStats((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      totalCookies: prev.totalCookies + earned,
    }));

    // Combo system
    setComboCount((prev) => {
      const newCombo = prev + 1;
      const newMult = Math.min(1 + Math.floor(newCombo / 5) * 0.5, 5); // Max x5
      setComboMultiplier(newMult);

      // Track max combo
      if (newCombo > gameStats.maxCombo) {
        setGameStats((gs) => ({ ...gs, maxCombo: newCombo }));
      }

      return newCombo;
    });

    // Reset combo after 1s inactivity
    clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(() => {
      setComboCount(0);
      setComboMultiplier(1);
    }, 1000);
  }, [cookiesPerClick, gameStats.maxCombo]);

  // Buy upgrade
  const handleBuyUpgrade = useCallback(
    (id) => {
      const upgrade = upgrades.find((u) => u.id === id);
      if (!upgrade) return;
      const cost = Math.floor(getUpgradeCost(upgrade.baseCost, upgrade.count) * costEffectReduction);
      if (cookies < cost) return;

      setCookies((c) => c - cost);
      setUpgrades((prev) =>
        prev.map((u) => (u.id === id ? { ...u, count: u.count + 1 } : u))
      );
      showFeedback(`${upgrade.icon} ${upgrade.name} acheté !`);
    },
    [cookies, upgrades, showFeedback, costEffectReduction]
  );

  // Buy multiplier
  const handleBuyMultiplier = useCallback(
    (id) => {
      const mult = multipliers.find((m) => m.id === id);
      if (!mult) return;
      const cost = Math.floor(getUpgradeCost(mult.baseCost, mult.count) * costEffectReduction);
      if (cookies < cost) return;

      setCookies((c) => c - cost);
      setMultipliers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, count: m.count + 1 } : m))
      );
      showFeedback(`${mult.icon} ${mult.name} acheté !`);
    },
    [cookies, multipliers, showFeedback, costEffectReduction]
  );

  // Prestige
  const handlePrestige = useCallback(() => {
    if (totalCookies < PRESTIGE_THRESHOLD) return;

    setPrestigeLevel((prev) => prev + 1);
    setCookies(0);
    setTotalCookies(0);
    setUpgrades(INITIAL_UPGRADES.map((u) => ({ ...u })));
    setMultipliers(INITIAL_MULTIPLIERS.map((m) => ({ ...m })));
    setGameStats((prev) => ({ ...prev, prestigeLevel: prev.prestigeLevel + 1 }));
    showFeedback('⭐ Prestige activé ! Bonus permanent obtenu !');
  }, [totalCookies, showFeedback]);

  // Golden Beer reward
  const handleGoldenReward = useCallback(
    (reward) => {
      setGameStats((prev) => ({ ...prev, goldenCaught: prev.goldenCaught + 1 }));

      if (reward.type === 'instant') {
        setCookies((prev) => prev + reward.value);
        setTotalCookies((prev) => prev + reward.value);
      } else {
        setActiveEffects((prev) => [
          ...prev,
          { ...reward, timeLeft: reward.duration },
        ]);
      }
      showFeedback(`✨ ${reward.label}`);
    },
    [showFeedback]
  );

  // Achievement unlocked
  const handleNewAchievement = useCallback(
    (achievement) => {
      setUnlockedAchievements((prev) => [...prev, achievement.id]);
      showFeedback(`🏆 Succès débloqué : ${achievement.name} !`);
    },
    [showFeedback]
  );

  // Festival handlers
  const handleFestivalStart = useCallback(
    (festival) => {
      setGameStats((prev) => ({
        ...prev,
        festivalsJoined: prev.festivalsJoined + 1,
      }));

      const effect = {
        type: 'festival',
        label: festival.name,
        timeLeft: festival.duration,
        multiplier: festival.multiplier || 1,
        clickMultiplier: festival.clickMultiplier || 1,
        costReduction: festival.costReduction || 1,
        color: festival.color,
      };
      setActiveEffects((prev) => [...prev, effect]);
      showFeedback(`🎪 ${festival.name} commence !`);
    },
    [showFeedback]
  );

  const handleFestivalEnd = useCallback(() => {
    showFeedback('🎪 Le festival est terminé !');
  }, [showFeedback]);

  // Settings handlers
  const handleResetSave = useCallback(() => {
    localStorage.removeItem(SAVE_PREFIX + currentUser);
    window.location.reload();
  }, [currentUser]);

  const handleExportSave = useCallback(() => {
    const saveData = {
      cookies, totalCookies, upgrades, multipliers, prestigeLevel,
      unlockedAchievements, gameStats, role: userRole,
    };
    return btoa(JSON.stringify(saveData));
  }, [cookies, totalCookies, upgrades, multipliers, prestigeLevel, unlockedAchievements, gameStats, userRole]);

  const handleImportSave = useCallback((encoded) => {
    const data = JSON.parse(atob(encoded));
    localStorage.setItem(SAVE_PREFIX + currentUser, JSON.stringify(data));
    window.location.reload();
  }, [currentUser]);

  // Compute game stats for achievements
  const totalUpgrades = upgrades.reduce((s, u) => s + u.count, 0) +
    multipliers.reduce((s, m) => s + m.count, 0);

  const achievementStats = {
    ...gameStats,
    totalCookies,
    totalUpgrades,
    prestigeLevel,
  };

  return (
    <div className="app">
      <BubbleBackground />

      <header className="app-header">
        <h1>🍺 Beer Clicker</h1>

        {/* Nom de l'utilisateur connecté */}
        <div className="user-info">
          <span className="user-name">
            {userRole === 'admin' ? '🛠️' : '🎮'} {currentUser}
          </span>
          <button className="logout-btn" onClick={onLogout} title="Déconnexion">
            🚪
          </button>
        </div>

        <div className="header-controls">
          {/* Le panneau Admin n'est visible que pour les admins */}
          {userRole === 'admin' && (
            <AdminPanel
              cookies={cookies}
              setCookies={setCookies}
              setTotalCookies={setTotalCookies}
              allPlayers={getAllPlayers()}
              currentUser={currentUser}
            />
          )}
          <Leaderboard currentUser={currentUser} />
          <Achievements
            gameStats={achievementStats}
            unlockedIds={unlockedAchievements}
            onNewAchievement={handleNewAchievement}
          />
          <SettingsPanel
            gameStats={achievementStats}
            onResetSave={handleResetSave}
            onExportSave={handleExportSave}
            onImportSave={handleImportSave}
          />
        </div>
      </header>

      {/* Offline earnings popup */}
      {offlineEarnings && (
        <div className="offline-popup" onClick={() => setOfflineEarnings(null)}>
          <div className="offline-content">
            <h3>🌙 Bon retour !</h3>
            <p>Pendant votre absence, vos brasseries ont produit :</p>
            <span className="offline-amount">+{Math.floor(offlineEarnings).toLocaleString()} 🍺</span>
            <button className="offline-close" onClick={() => setOfflineEarnings(null)}>
              Super !
            </button>
          </div>
        </div>
      )}

      {feedbackMessage && (
        <div className="feedback-toast">{feedbackMessage}</div>
      )}

      {/* Active effects bar */}
      {activeEffects.length > 0 && (
        <div className="effects-bar">
          {activeEffects.map((effect, i) => (
            <div
              key={i}
              className="effect-badge"
              style={{ borderColor: effect.color || 'var(--accent-amber)' }}
            >
              <span className="effect-label">{effect.label}</span>
              <span className="effect-timer">{effect.timeLeft}s</span>
            </div>
          ))}
        </div>
      )}

      {/* Combo indicator */}
      {comboCount >= 5 && (
        <div className={`combo-indicator combo-level-${Math.min(Math.floor(comboCount / 5), 4)}`}>
          🔥 COMBO ×{comboMultiplier.toFixed(1)} ({comboCount} clics)
        </div>
      )}

      <main className="game-layout">
        {/* Left panel — Stats */}
        <aside className="panel panel-left">
          <Stats
            cookies={cookies}
            cookiesPerClick={cookiesPerClick}
            prestigeLevel={prestigeLevel}
          />
          <FestivalEvent
            onFestivalStart={handleFestivalStart}
            onFestivalEnd={handleFestivalEnd}
          />
          <PrestigePanel
            totalCookies={totalCookies}
            prestigeLevel={prestigeLevel}
            onPrestige={handlePrestige}
          />
        </aside>

        {/* Center — Cookie */}
        <section className="panel panel-center">
          <CookieButton
            cookies={cookies}
            totalCookies={totalCookies}
            cookiesPerClick={cookiesPerClick}
            onCookieClick={handleClick}
          />
          <GoldenBeer
            cookiesPerSecond={cookiesPerSecond}
            onReward={handleGoldenReward}
          />
        </section>

        {/* Right panel — Upgrades */}
        <aside className="panel panel-right">
          <UpgradeList
            upgrades={upgrades}
            multipliers={multipliers}
            cookies={cookies}
            onBuyUpgrade={handleBuyUpgrade}
            onBuyMultiplier={handleBuyMultiplier}
            costReduction={costEffectReduction}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
