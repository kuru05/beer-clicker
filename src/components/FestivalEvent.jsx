import { useState, useEffect, useCallback } from 'react';
import { FESTIVALS } from '../data/features';

function FestivalEvent({ onFestivalStart, onFestivalEnd }) {
    const [activeFestival, setActiveFestival] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [nextFestivalIn, setNextFestivalIn] = useState(0);

    // Schedule random festivals
    useEffect(() => {
        const scheduleNext = () => {
            const delay = 60000 + Math.random() * 180000; // 1-4 min
            setNextFestivalIn(Math.floor(delay / 1000));
            return setTimeout(() => {
                if (!activeFestival) {
                    const festival = FESTIVALS[Math.floor(Math.random() * FESTIVALS.length)];
                    startFestival(festival);
                }
                scheduleNext();
            }, delay);
        };

        const timeout = scheduleNext();
        return () => clearTimeout(timeout);
    }, []);

    // Countdown for next festival
    useEffect(() => {
        if (activeFestival) return;
        const interval = setInterval(() => {
            setNextFestivalIn((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [activeFestival]);

    // Festival countdown
    useEffect(() => {
        if (!activeFestival) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setActiveFestival(null);
                    onFestivalEnd();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeFestival, onFestivalEnd]);

    const startFestival = useCallback(
        (festival) => {
            setActiveFestival(festival);
            setTimeLeft(festival.duration);
            onFestivalStart(festival);
        },
        [onFestivalStart]
    );

    if (!activeFestival) {
        return (
            <div className="festival-widget idle">
                <span className="festival-icon">🎪</span>
                <span className="festival-next">
                    Prochain festival : {nextFestivalIn > 0 ? `~${nextFestivalIn}s` : 'bientôt...'}
                </span>
            </div>
        );
    }

    const progressPct = (timeLeft / activeFestival.duration) * 100;

    return (
        <div
            className="festival-widget active"
            style={{ borderColor: activeFestival.color }}
        >
            <div className="festival-active-header">
                <span className="festival-name">{activeFestival.name}</span>
                <span className="festival-timer">{timeLeft}s</span>
            </div>
            <p className="festival-desc">{activeFestival.description}</p>
            <div className="festival-bar">
                <div
                    className="festival-bar-fill"
                    style={{
                        width: `${progressPct}%`,
                        background: activeFestival.color,
                    }}
                />
            </div>
        </div>
    );
}

export default FestivalEvent;
