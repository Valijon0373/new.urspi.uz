import { useState, useRef } from 'react';

export default function JusticeScale3D() {
    const containerRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Mouse look around effect (perspective tilt)
        const rotateY = ((x - centerX) / centerX) * 15; 
        const rotateX = -((y - centerY) / centerY) * 15;

        setRotation({ x: rotateX, y: rotateY });
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[600px] h-[500px] mx-auto flex items-center justify-center cursor-pointer"
            style={{ perspective: '1200px' }}
        >
            <div 
                className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ 
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Glow Effect behind */}
                <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] rounded-full translate-z-[-50px]" style={{ transform: 'translateZ(-50px)' }} />
                
                {/* 3D Animated SVG Scale */}
                <div 
                    className="relative w-[400px] lg:w-[450px] h-[450px] drop-shadow-2xl translate-z-[50px] mt-10 transition-transform duration-300 ease-out"
                    style={{ transform: `translateZ(50px) scale(${isHovered ? 1.08 : 1})` }}
                >
                    <svg viewBox="0 0 400 450" className="w-full h-full overflow-visible">
                        <defs>
                            {/* Realistic Gold Gradients */}
                            <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#B38728" />
                                <stop offset="25%" stopColor="#FBF5B7" />
                                <stop offset="50%" stopColor="#DAA520" />
                                <stop offset="75%" stopColor="#FBF5B7" />
                                <stop offset="100%" stopColor="#8A5A19" />
                            </linearGradient>
                            
                            <linearGradient id="gold-pillar" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8A5A19" />
                                <stop offset="20%" stopColor="#DAA520" />
                                <stop offset="50%" stopColor="#FBF5B7" />
                                <stop offset="80%" stopColor="#DAA520" />
                                <stop offset="100%" stopColor="#8A5A19" />
                            </linearGradient>

                            <linearGradient id="gold-pan" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#FBF5B7" />
                                <stop offset="40%" stopColor="#DAA520" />
                                <stop offset="100%" stopColor="#8A5A19" />
                            </linearGradient>

                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.4"/>
                            </filter>
                        </defs>

                        {/* Stand Base */}
                        <g filter="url(#shadow)">
                            <path d="M 120 400 L 280 400 C 295 400 305 410 305 420 L 95 420 C 95 410 105 400 120 400 Z" fill="url(#gold-metal)" />
                            <path d="M 140 380 L 260 380 L 280 400 L 120 400 Z" fill="url(#gold-pillar)" />
                            <path d="M 160 360 L 240 360 L 260 380 L 140 380 Z" fill="url(#gold-metal)" />
                            <rect x="175" y="340" width="50" height="20" rx="5" fill="url(#gold-pillar)" />
                        </g>
                        
                        {/* Central Pillar */}
                        <rect x="185" y="100" width="30" height="245" rx="15" fill="url(#gold-pillar)" filter="url(#shadow)" />
                        
                        {/* Top joint/ornament */}
                        <g filter="url(#shadow)">
                            <circle cx="200" cy="90" r="22" fill="url(#gold-metal)" />
                            <polygon points="200,30 215,70 185,70" fill="url(#gold-metal)" />
                            <circle cx="200" cy="30" r="6" fill="url(#gold-pillar)" />
                        </g>
                        
                        {/* Rotating Beam and Pans */}
                        <g style={{ transformOrigin: '200px 90px', animation: 'tiltScale 5s ease-in-out infinite' }}>
                            {/* The Beam */}
                            <path d="M 30 85 Q 200 60 370 85 L 370 98 Q 200 73 30 98 Z" fill="url(#gold-metal)" filter="url(#shadow)" />
                            
                            {/* Hooks */}
                            <circle cx="40" cy="91" r="8" fill="url(#gold-pillar)" filter="url(#shadow)" />
                            <circle cx="360" cy="91" r="8" fill="url(#gold-pillar)" filter="url(#shadow)" />

                            {/* Left Pan Assembly */}
                            <g style={{ transformOrigin: '40px 91px', animation: 'counterTilt 5s ease-in-out infinite' }}>
                                {/* Chains */}
                                <line x1="40" y1="91" x2="0" y2="280" stroke="url(#gold-metal)" strokeWidth="3" />
                                <line x1="40" y1="91" x2="80" y2="280" stroke="url(#gold-metal)" strokeWidth="3" />
                                <line x1="40" y1="91" x2="40" y2="290" stroke="url(#gold-metal)" strokeWidth="1.5" opacity="0.6" />
                                
                                {/* Pan */}
                                <ellipse cx="40" cy="280" rx="45" ry="12" fill="url(#gold-pillar)" />
                                <path d="M -5 280 C -5 320 85 320 85 280 Z" fill="url(#gold-pan)" filter="url(#shadow)" />
                            </g>

                            {/* Right Pan Assembly */}
                            <g style={{ transformOrigin: '360px 91px', animation: 'counterTilt 5s ease-in-out infinite' }}>
                                {/* Chains */}
                                <line x1="360" y1="91" x2="320" y2="280" stroke="url(#gold-metal)" strokeWidth="3" />
                                <line x1="360" y1="91" x2="400" y2="280" stroke="url(#gold-metal)" strokeWidth="3" />
                                <line x1="360" y1="91" x2="360" y2="290" stroke="url(#gold-metal)" strokeWidth="1.5" opacity="0.6" />
                                
                                {/* Pan */}
                                <ellipse cx="360" cy="280" rx="45" ry="12" fill="url(#gold-pillar)" />
                                <path d="M 315 280 C 315 320 405 320 405 280 Z" fill="url(#gold-pan)" filter="url(#shadow)" />
                            </g>
                        </g>
                    </svg>
                    
                    {/* Inject inline CSS for keyframes */}
                    <style>{`
                        @keyframes tiltScale {
                            0%, 100% { transform: rotate(10deg); }
                            50% { transform: rotate(-10deg); }
                        }
                        @keyframes counterTilt {
                            0%, 100% { transform: rotate(-10deg); }
                            50% { transform: rotate(10deg); }
                        }
                    `}</style>
                </div>
            </div>
            
            {/* Base shadow on ground */}
            <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[350px] h-[30px] bg-black/20 blur-[20px] rounded-[100%]" />
        </div>
    );
}
