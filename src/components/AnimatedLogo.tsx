import React from 'react';

const AnimatedLogo: React.FC = () => {
    return (
        <div className="animated-logo-container" style={{ position: 'relative', width: '100%', height: '60px', overflow: 'visible', display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 400 60" width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                    {/* Cyberpunk Glitch Filter */}
                    <filter id="cyber-glitch">
                        {/* 1. Base Turbulence for distortion */}
                        <feTurbulence type="fractalNoise" baseFrequency="0.0001 0.0001" numOctaves="1" result="noise">
                            <animate attributeName="baseFrequency" values="0.0001 0.0001;0.005 0.005;0.0001 0.0001" dur="3s" repeatCount="indefinite" keyTimes="0;0.1;1" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" result="distorted" />

                        {/* 2. RGB Split / Chromatic Aberration Simulation */}
                        <feOffset in="distorted" dx="-2" dy="0" result="red-offset">
                            <animate attributeName="dx" values="-2;2;-2" dur="0.2s" repeatCount="indefinite" />
                        </feOffset>
                        <feOffset in="distorted" dx="2" dy="0" result="blue-offset">
                            <animate attributeName="dx" values="2;-2;2" dur="0.2s" repeatCount="indefinite" />
                        </feOffset>

                        {/* 3. Combine for "Glitch" look (Simplified for SVG) */}
                        {/* Since we can't easily do mix-blend-mode inside filter, we'll just output the distorted graphic with a heavy glow */}
                        <feGaussianBlur in="distorted" stdDeviation="0.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="distorted" />
                        </feMerge>
                    </filter>

                    {/* Neon Glow Filter */}
                    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Cyber Grid Pattern (Optional background) */}
                    <pattern id="cyber-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 255, 136, 0.1)" strokeWidth="1" />
                    </pattern>
                </defs>

                {/* Background Grid */}
                <rect width="100%" height="100%" fill="url(#cyber-grid)" opacity="0.5" />

                {/* Main Text Layer - Cyberpunk Style */}
                <text
                    x="50%"
                    y="55%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="#00ff88"
                    style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        fontFamily: '"Courier New", Courier, monospace', // Monospace fits Cyberpunk well
                        letterSpacing: '2px',
                        filter: 'url(#cyber-glitch)',
                        textShadow: '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 20px #00ff88',
                        textTransform: 'uppercase'
                    }}
                >
                    BANK CRYPTO VAULT
                </text>

                {/* Overlay "Scanline" or "Glitch" Text (Red/Blue offset simulated via separate text elements if needed, but filter handles some) */}
            </svg>
        </div>
    );
};

export default AnimatedLogo;
