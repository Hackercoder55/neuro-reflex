import React, { useEffect, useState, useRef } from 'react';
import { Zap, ZapOff, Clock } from 'lucide-react';
import { Howl } from 'howler';

interface ReactionTestProps {
  gameState: 'idle' | 'ready' | 'waiting' | 'click' | 'results';
  currentTime: number | null;
  round: number;
  bestScore: number | null;
  gameMode: 'standard' | 'progressive';
  handleClick: () => void;
  startGame: () => void;
}

const ReactionTest: React.FC<ReactionTestProps> = ({
  gameState,
  currentTime,
  round,
  bestScore,
  gameMode,
  handleClick,
  startGame
}) => {
  const [pulseEffect, setPulseEffect] = useState(false);
  const [molePosition, setMolePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Sound effects
  const sounds = {
    background: new Howl({
      src: ['https://assets.codepen.io/982762/cyberpunk-ambient.mp3'],
      loop: true,
      volume: 0.3
    }),
    hit: new Howl({
      src: ['https://assets.codepen.io/982762/punch.mp3'],
      volume: 0.5
    }),
    appear: new Howl({
      src: ['https://assets.codepen.io/982762/swoosh.mp3'],
      volume: 0.4
    }),
    miss: new Howl({
      src: ['https://assets.codepen.io/982762/error.mp3'],
      volume: 0.4
    })
  };

  useEffect(() => {
    // Start background music when component mounts
    sounds.background.play();
    return () => sounds.background.stop();
  }, []);

  useEffect(() => {
    if (gameState === 'click') {
      setPulseEffect(true);
      sounds.appear.play();
      
      // Random position for the mole
      if (containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const maxX = container.width - 100; // Account for mole size
        const maxY = container.height - 100;
        
        setMolePosition({
          x: Math.random() * maxX,
          y: Math.random() * maxY
        });
      }
      
      const timer = setTimeout(() => setPulseEffect(false), 300);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleMoleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the miss event from firing
    if (gameState === 'click') {
      sounds.hit.play();
      handleClick();
    }
  };

  const handleMiss = () => {
    if (gameState === 'click') {
      sounds.miss.play();
      // Add a 500ms penalty for missing
      setTimeout(() => {
        handleClick();
      }, 500);
    }
  };

  const getProgressiveDifficultyClass = () => {
    if (gameMode !== 'progressive' || round <= 1) return '';
    const effects = [];
    if (round > 3) effects.push('animate-flicker');
    if (round > 5) effects.push('animate-glitch');
    return effects.join(' ');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'idle':
        return (
          <button 
            onClick={startGame}
            className="w-full h-full flex flex-col justify-center items-center transition-all transform hover:scale-105 hover:brightness-110"
          >
            <Zap className="w-16 h-16 mb-4 text-cyan-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 font-mono tracking-wider">
              WHACK THE CYBER-MOLE
            </h2>
            <p className="text-cyan-300 text-lg">Click to start</p>
            <p className="text-gray-400 text-sm mt-2">Miss = 500ms penalty</p>
          </button>
        );
        
      case 'ready':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Clock className="w-16 h-16 mb-4 text-yellow-400 animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2 font-mono tracking-wider">
              GET READY
            </h2>
            <p className="text-cyan-300 text-lg">Wait for the cyber-mole...</p>
          </div>
        );
        
      case 'waiting':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <ZapOff className="w-16 h-16 mb-4 text-red-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-2 font-mono tracking-wider">
              WAIT
            </h2>
            <p className="text-gray-300 text-lg">Don't whack yet!</p>
          </div>
        );
        
      case 'click':
        return (
          <div 
            className="w-full h-full relative"
            onClick={handleMiss}
          >
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                         bg-cyan-400 rounded-full p-4 shadow-[0_0_20px_rgba(6,182,212,0.5)]
                         hover:bg-cyan-300 transition-all animate-bounce"
              style={{ 
                left: `${molePosition.x}px`,
                top: `${molePosition.y}px`
              }}
              onClick={handleMoleClick}
            >
              <Zap className="w-12 h-12 text-black" />
            </div>
          </div>
        );
        
      case 'results':
        if (currentTime === -1) {
          return (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <ZapOff className="w-16 h-16 mb-4 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-2 font-mono tracking-wider">
                TOO EARLY
              </h2>
              <p className="text-gray-300 text-lg">You whacked before the mole appeared</p>
            </div>
          );
        } else {
          const isBestScore = bestScore === currentTime;
          return (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <Clock className={`w-16 h-16 mb-4 ${isBestScore ? 'text-yellow-400' : 'text-cyan-400'}`} />
              <h2 className={`text-2xl md:text-3xl font-bold mb-2 font-mono tracking-wider ${isBestScore ? 'text-yellow-400' : 'text-cyan-400'}`}>
                {currentTime} ms
              </h2>
              {isBestScore && (
                <p className="text-yellow-400 text-lg font-bold">NEW BEST TIME!</p>
              )}
              <p className="text-gray-300 text-lg mt-2">
                {currentTime && currentTime < 200 
                  ? 'Lightning-fast reflexes!' 
                  : currentTime && currentTime < 300 
                  ? 'Quick whack!'
                  : 'Keep practicing your whack!'}
              </p>
            </div>
          );
        }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`
        bg-gray-900 border-2 border-cyan-500 rounded-lg p-4 h-80
        shadow-[0_0_15px_rgba(6,182,212,0.5)]
        transition-all duration-300 relative overflow-hidden
        ${getProgressiveDifficultyClass()}
      `}
    >
      {gameMode === 'progressive' && round > 1 && (
        <div className="mb-3 text-center">
          <span className="inline-block bg-cyan-900 text-cyan-300 px-3 py-1 rounded-full text-sm font-mono">
            ROUND {round}
          </span>
        </div>
      )}
      
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 opacity-10 pointer-events-none">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border border-cyan-500"></div>
        ))}
      </div>
      
      {renderContent()}
    </div>
  );
};

export default ReactionTest;