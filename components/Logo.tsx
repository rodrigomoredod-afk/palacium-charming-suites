
import React, { useState } from 'react';
import { logoImageUrl } from '../images';

interface LogoProps {
  className?: string;
  color?: 'gold' | 'white' | 'charcoal';
  showText?: boolean;
}

/** See `images.ts` — Google Drive link must allow “anyone with the link”. */
const LOGO_IMAGE_URL = logoImageUrl;

const Logo: React.FC<LogoProps> = ({ 
  className = "h-16", 
  color = 'gold',
  showText = true 
}) => {
  const [imageError, setImageError] = useState(false);

  const colors = {
    gold: '#B89352',
    white: '#FFFFFF',
    charcoal: '#1A1A1A'
  };

  const currentColor = colors[color];

  const imageFilterByColor: Record<LogoProps['color'], string> = {
    white: 'brightness(0) invert(1)',
    // Approximate brand gold from a black source logo.
    gold: 'brightness(0) saturate(100%) invert(67%) sepia(22%) saturate(847%) hue-rotate(357deg) brightness(90%) contrast(88%)',
    charcoal: 'none',
  };

  // Se houver uma imagem definida e ela NÃO deu erro, tentamos renderizá-la
  if (LOGO_IMAGE_URL && !imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img 
          src={LOGO_IMAGE_URL} 
          alt="Palacium Logo" 
          className="h-full w-auto object-contain"
          style={{
            filter: imageFilterByColor[color],
          }}
          onError={() => {
            console.warn("Logo image failed to load, falling back to SVG.");
            setImageError(true);
          }}
        />
      </div>
    );
  }

  // Caso contrário (sem URL ou erro no carregamento), renderizamos o design vetorial original (Fallback)
  return (
    <div className={`flex flex-col items-center justify-center text-center transition-colors duration-500 ${className}`}>
      {/* Iconography: Crest, Shield and Flourishes */}
      <svg 
        viewBox="0 0 240 100" 
        className="h-3/5 w-auto mb-1" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Crest Ornament */}
        <path 
          d="M120 4 L123 8 L120 12 L117 8 L120 4Z" 
          fill={currentColor} 
        />
        <path 
          d="M112 10 Q120 6 128 10 Q120 14 112 10" 
          fill={currentColor} 
        />

        {/* Main Shield */}
        <path 
          d="M120 15 L142 22 V45 C142 62 120 75 120 75 C120 75 98 62 98 45 V22 L120 15Z" 
          stroke={currentColor} 
          strokeWidth="1.5" 
          strokeLinejoin="round"
        />
        
        {/* Inner Serif P */}
        <text 
          x="120" 
          y="56" 
          fontFamily="Playfair Display, serif" 
          fontSize="42" 
          fontWeight="600" 
          fill={currentColor} 
          textAnchor="middle"
        >P</text>

        {/* Left Flourish */}
        <path 
          d="M90 45 C80 30 65 35 70 50 C75 60 85 55 90 48" 
          stroke={currentColor} 
          strokeWidth="1.2" 
          fill="none" 
        />
        <path 
          d="M72 52 C60 55 55 45 60 35" 
          stroke={currentColor} 
          strokeWidth="0.8" 
          fill="none" 
        />

        {/* Right Flourish */}
        <path 
          d="M150 45 C160 30 175 35 170 50 C165 60 155 55 150 48" 
          stroke={currentColor} 
          strokeWidth="1.2" 
          fill="none" 
        />
        <path 
          d="M168 52 C180 55 185 45 180 35" 
          stroke={currentColor} 
          strokeWidth="0.8" 
          fill="none" 
        />
      </svg>

      {/* Typography Section */}
      {showText && (
        <div className="flex flex-col items-center w-full">
          <h1 
            className="font-serif text-[1.1rem] md:text-[1.3rem] leading-none tracking-[0.2em] uppercase"
            style={{ color: currentColor, fontWeight: 500 }}
          >
            Palacium
          </h1>
          <h2 
            className="text-[0.6rem] md:text-[0.7rem] tracking-[0.4em] uppercase font-sans font-semibold mt-1 mb-2"
            style={{ color: currentColor, opacity: 0.9 }}
          >
            Group
          </h2>
          
          <div 
            className="w-24 md:w-32 h-[0.5px] mb-2" 
            style={{ backgroundColor: currentColor, opacity: 0.5 }}
          ></div>
          
          <p 
            className="text-[0.45rem] md:text-[0.5rem] tracking-[0.5em] uppercase font-sans font-bold whitespace-nowrap"
            style={{ color: currentColor }}
          >
            Charming Suites
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
