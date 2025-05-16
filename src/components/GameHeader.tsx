import React from 'react';
import { Ghost, Activity, RefreshCw } from 'lucide-react';

interface GameHeaderProps {
  gameMode: 'standard' | 'progressive';
  toggleGameMode: () => void;
  isGhostActive: boolean;
  toggleGhost: () => void;
  resetScores: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  gameMode,
  toggleGameMode,
  isGhostActive,
  toggleGhost,
  resetScores
}) => {
  return (
    <header className="p-4 border-b border-cyan-900 relative">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 font-mono tracking-widest mb-1 animate-glow">
            <span className="text-yellow-400">NEURO</span>REFLEX
          </h1>
          <p className="text-cyan-600 text-sm">CYBERNETIC REACTION TESTING SYSTEM v2.5.77</p>
        </div>
        
        <div className="flex flex-wrap justify-center md:justify-end gap-3">
          <button 
            onClick={toggleGameMode}
            className={`
              px-4 py-2 rounded text-sm font-medium font-mono
              flex items-center gap-2 transition-all
              ${gameMode === 'standard' 
                ? 'bg-cyan-900 text-cyan-300 hover:bg-cyan-800' 
                : 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800'}
            `}
          >
            <Activity className="w-4 h-4" />
            {gameMode === 'standard' ? 'STANDARD MODE' : 'PROGRESSIVE MODE'}
          </button>
          
          <button 
            onClick={toggleGhost}
            className={`
              px-4 py-2 rounded text-sm font-medium font-mono
              flex items-center gap-2 transition-all
              ${isGhostActive 
                ? 'bg-purple-900 text-purple-300 hover:bg-purple-800' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
            `}
          >
            <Ghost className="w-4 h-4" />
            {isGhostActive ? 'GHOST ACTIVE' : 'GHOST DISABLED'}
          </button>
          
          <button 
            onClick={resetScores}
            className="
              px-4 py-2 rounded text-sm font-medium font-mono
              flex items-center gap-2 transition-all
              bg-red-900 text-red-300 hover:bg-red-800
            "
          >
            <RefreshCw className="w-4 h-4" />
            RESET DATA
          </button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute left-0 bottom-0 w-32 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
      <div className="absolute right-0 bottom-0 w-32 h-1 bg-gradient-to-l from-cyan-500 to-transparent"></div>
    </header>
  );
};

export default GameHeader;