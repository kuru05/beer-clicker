import { useState, useCallback } from 'react';
import { BEER_STAGES } from '../data/gameData';

function CookieButton({ cookies, totalCookies, cookiesPerClick, onCookieClick }) {
    const [particles, setParticles] = useState([]);
    const [isClicked, setIsClicked] = useState(false);

    // Determine current beer stage
    const currentStage = [...BEER_STAGES]
        .reverse()
        .find((stage) => totalCookies >= stage.threshold) || BEER_STAGES[0];

    // Next stage info for progress
    const currentIndex = BEER_STAGES.indexOf(currentStage);
    const nextStage = BEER_STAGES[currentIndex + 1] || null;
    const progress = nextStage
        ? ((totalCookies - currentStage.threshold) /
            (nextStage.threshold - currentStage.threshold)) *
        100
        : 100;

    const handleClick = useCallback(
        (e) => {
            onCookieClick();

            // Click animation
            setIsClicked(true);
            setTimeout(() => setIsClicked(false), 150);

            // Floating particle
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now() + Math.random();
            const offsetX = (Math.random() - 0.5) * 60;

            setParticles((prev) => [
                ...prev,
                { id, x: x + offsetX, y, value: cookiesPerClick },
            ]);

            setTimeout(() => {
                setParticles((prev) => prev.filter((p) => p.id !== id));
            }, 1000);
        },
        [onCookieClick, cookiesPerClick]
    );

    return (
        <div className="cookie-button-container">
            <h2 className="beer-stage-label">{currentStage.label}</h2>

            <div
                className={`cookie-button ${isClicked ? 'clicked' : ''}`}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                aria-label="Cliquez pour produire de la bière"
            >
                <img
                    src={currentStage.image}
                    alt={currentStage.label}
                    className="beer-image"
                    style={{
                        width: `${currentStage.size}px`,
                        height: `${currentStage.size}px`,
                    }}
                    draggable={false}
                />

                {/* Floating click particles */}
                {particles.map((p) => (
                    <span
                        key={p.id}
                        className="click-particle"
                        style={{ left: p.x, top: p.y }}
                    >
                        +{p.value}
                    </span>
                ))}
            </div>

            {/* Evolution progress bar */}
            {nextStage && (
                <div className="evolution-progress">
                    <div className="evolution-progress-label">
                        Prochaine évolution : {nextStage.label}
                    </div>
                    <div className="evolution-bar">
                        <div
                            className="evolution-bar-fill"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CookieButton;
