import React, { useEffect, useState } from 'react';
import './SeasonEffects.css';

export default function SeasonEffects() {
  const [activeSeason, setActiveSeason] = useState(() => {
    return localStorage.getItem('app-season');
  });

  useEffect(() => {
    const handleSeasonChange = () => {
      setActiveSeason(localStorage.getItem('app-season'));
    };

    window.addEventListener('season-change', handleSeasonChange);
    // Support regular storage event if changed from other tabs
    window.addEventListener('storage', handleSeasonChange);

    return () => {
      window.removeEventListener('season-change', handleSeasonChange);
      window.removeEventListener('storage', handleSeasonChange);
    };
  }, []);

  if (!activeSeason || activeSeason === 'yoz') return null;

  // Generate 50 particles
  const particles = Array.from({ length: 50 });
  const rainDrops = activeSeason === 'kuz' ? Array.from({ length: 80 }) : [];

  return (
    <div className={`season-effects-container pointer-events-none`}>
      {/* Existing particles (snow, petals, leaves) */}
      {particles.map((_, i) => {
        const left = Math.random() * 100;
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * -10;
        const size = Math.random() * 0.5 + 0.8;
        const spinDuration = Math.random() * 2 + 2;

        return (
          <div
            key={`p-${i}`}
            className={`particle particle-${activeSeason}`}
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            <div
              className="particle-shape"
              style={{
                transform: `scale(${size})`,
                animationDuration: `${spinDuration}s`,
              }}
            />
          </div>
        );
      })}
      
      {/* Rain drops for Autumn */}
      {rainDrops.map((_, i) => {
        const left = Math.random() * 120 - 10;
        const duration = Math.random() * 0.5 + 0.5;
        const delay = Math.random() * -2;
        return (
          <div
            key={`r-${i}`}
            className="rain-particle"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
