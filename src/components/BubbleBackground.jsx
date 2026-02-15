import { useEffect, useRef, useState } from 'react';

function BubbleBackground() {
    const canvasRef = useRef(null);
    const bubblesRef = useRef([]);
    const animRef = useRef(null);
    const [dimensions, setDimensions] = useState({ w: window.innerWidth, h: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ w: window.innerWidth, h: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = dimensions.w;
        canvas.height = dimensions.h;

        // Initialize bubbles
        if (bubblesRef.current.length === 0) {
            for (let i = 0; i < 25; i++) {
                bubblesRef.current.push(createBubble(dimensions.w, dimensions.h, true));
            }
        }

        function createBubble(w, h, initial = false) {
            return {
                x: Math.random() * w,
                y: initial ? Math.random() * h : h + 20,
                radius: 2 + Math.random() * 6,
                speed: 0.2 + Math.random() * 0.6,
                opacity: 0.03 + Math.random() * 0.08,
                wobbleSpeed: 0.01 + Math.random() * 0.02,
                wobbleAmount: 15 + Math.random() * 25,
                phase: Math.random() * Math.PI * 2,
            };
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            bubblesRef.current.forEach((bubble, i) => {
                bubble.y -= bubble.speed;
                bubble.phase += bubble.wobbleSpeed;
                const wobbleX = Math.sin(bubble.phase) * bubble.wobbleAmount;

                ctx.beginPath();
                ctx.arc(bubble.x + wobbleX, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(245, 158, 11, ${bubble.opacity})`;
                ctx.fill();

                // Smaller highlight
                ctx.beginPath();
                ctx.arc(
                    bubble.x + wobbleX - bubble.radius * 0.3,
                    bubble.y - bubble.radius * 0.3,
                    bubble.radius * 0.3,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.5})`;
                ctx.fill();

                if (bubble.y < -20) {
                    bubblesRef.current[i] = createBubble(canvas.width, canvas.height);
                }
            });

            animRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [dimensions]);

    return (
        <canvas
            ref={canvasRef}
            className="bubble-canvas"
            aria-hidden="true"
        />
    );
}

export default BubbleBackground;
