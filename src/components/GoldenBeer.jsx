import { useState, useEffect, useCallback, useRef } from 'react';
import { GOLDEN_BEER } from '../data/features';

function GoldenBeer({ cookiesPerSecond, onReward }) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [fading, setFading] = useState(false);
    const timeoutRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    const scheduleNext = useCallback(() => {
        const delay =
            GOLDEN_BEER.minInterval +
            Math.random() * (GOLDEN_BEER.maxInterval - GOLDEN_BEER.minInterval);

        timeoutRef.current = setTimeout(() => {
            setPosition({
                x: 10 + Math.random() * 70,
                y: 15 + Math.random() * 60,
            });
            setVisible(true);
            setFading(false);

            hideTimeoutRef.current = setTimeout(() => {
                setFading(true);
                setTimeout(() => {
                    setVisible(false);
                    scheduleNext();
                }, 500);
            }, GOLDEN_BEER.displayDuration);
        }, delay);
    }, []);

    useEffect(() => {
        scheduleNext();
        return () => {
            clearTimeout(timeoutRef.current);
            clearTimeout(hideTimeoutRef.current);
        };
    }, [scheduleNext]);

    const handleClick = useCallback(() => {
        clearTimeout(hideTimeoutRef.current);
        setVisible(false);

        // Pick random reward
        const reward =
            GOLDEN_BEER.rewards[Math.floor(Math.random() * GOLDEN_BEER.rewards.length)];

        if (reward.type === 'instant') {
            const value = reward.getValue(cookiesPerSecond);
            onReward({
                type: 'instant',
                value,
                label: `${reward.label} +${Math.floor(value)} 🍺`,
            });
        } else if (reward.type === 'frenzy') {
            onReward({
                type: 'frenzy',
                multiplier: reward.multiplier,
                duration: reward.duration,
                label: `${reward.label} Production ×${reward.multiplier} pendant ${reward.duration}s`,
            });
        } else if (reward.type === 'clickBoost') {
            onReward({
                type: 'clickBoost',
                multiplier: reward.multiplier,
                duration: reward.duration,
                label: `${reward.label} Clics ×${reward.multiplier} pendant ${reward.duration}s`,
            });
        }

        scheduleNext();
    }, [cookiesPerSecond, onReward, scheduleNext]);

    if (!visible) return null;

    return (
        <div
            className={`golden-beer ${fading ? 'fading' : ''}`}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            onClick={handleClick}
            role="button"
            aria-label="Bière dorée bonus"
        >
            <span className="golden-beer-emoji">🍺</span>
            <div className="golden-beer-glow" />
        </div>
    );
}

export default GoldenBeer;
