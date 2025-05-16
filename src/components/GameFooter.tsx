import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface GameFooterProps {
  gameState: 'idle' | 'ready' | 'waiting' | 'click' | 'results';
  currentTime: number | null;
  nextRound: () => void;
  resetGame: () => void;
}

const GameFooter: React.FC<GameFooterProps> = ({
  gameState,
  currentTime,
  nextRound,
  resetGame
}) => {
  return (
    <footer className="p-4 border-t border-cyan-900 mt-auto relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-cyan-600 font-mono text-sm">
          {gameState === 'idle' && 'AWAITING INPUT...'}
          {gameState === 'ready' && 'INITIALIZING TEST SEQUENCE...'}
          {gameState === 'waiting' && 'STANDBY FOR SIGNAL...'}
          {gameState === 'click' && 'REACTION WINDOW ACTIVE!'}
          {gameState === 'results' && currentTime === -1 && 'EARLY TRIGGER DETECTED'}
          {gameState === 'results' && currentTime !== -1 && 'TEST COMPLETE'}
        </div>
        
        <div className="flex gap-3">
          {gameState === 'results' && (
            <>
              <button 
                onClick={nextRound}
                className="
                  px-4 py-2 rounded text-sm font-medium font-mono
                  flex items-center gap-2 transition-all
                  bg-cyan-900 text-cyan-300 hover:bg-cyan-800
                  shadow-[0_0_10px_rgba(6,182,212,0.3)]
                "
              >
                <ArrowRight className="w-4 h-4" />
                NEXT ROUND
              </button>
              
              <button 
                onClick={resetGame}
                className="
                  px-4 py-2 rounded text-sm font-medium font-mono
                  flex items-center gap-2 transition-all
                  bg-gray-800 text-gray-400 hover:bg-gray-700
                "
              >
                <RotateCcw className="w-4 h-4" />
                RESET
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 w-32 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
      <div className="absolute right-0 top-0 w-32 h-1 bg-gradient-to-l from-cyan-500 to-transparent"></div>
    </footer>
  );
};

export default GameFooter;