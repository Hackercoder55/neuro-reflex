import React, { useEffect, useState } from 'react';
import { Trophy, Clock, ZapOff, Zap, BarChart } from 'lucide-react';
import ReactionTest from './ReactionTest';
import ScoreBoard from './ScoreBoard';
import useScoreManager from '../hooks/useScoreManager';
import GhostReplay from './GhostReplay';
import GameHeader from './GameHeader';
import GameFooter from './GameFooter';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'ready' | 'waiting' | 'click' | 'results'>('idle');
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<'standard' | 'progressive'>('standard');
  const [round, setRound] = useState(1);
  const [isGhostActive, setIsGhostActive] = useState(true);
  
  const {
    scores,
    bestScore,
    addScore,
    getAverageScore,
    resetScores,
    getWorstScore,
    bestScoreTimeline,
  } = useScoreManager();

  const startGame = () => {
    setGameState('ready');
    setCurrentTime(null);
    setTimeout(() => {
      setGameState('waiting');
      const delay = 2000 + Math.random() * 4000; // Random delay between 2-6 seconds
      setTimeout(() => {
        setGameState('click');
        setStartTime(Date.now());
      }, delay);
    }, 1500);
  };

  const handleClick = () => {
    if (gameState === 'click' && startTime) {
      const endTime = Date.now();
      const reactionTime = endTime - startTime;
      setCurrentTime(reactionTime);
      addScore(reactionTime);
      setGameState('results');
    } else if (gameState === 'waiting') {
      // Clicked too early
      setGameState('results');
      setCurrentTime(-1); // Use -1 to indicate too early
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setCurrentTime(null);
    setStartTime(null);
    setRound(1);
  };

  const nextRound = () => {
    if (gameMode === 'progressive') {
      setRound(round + 1);
    }
    startGame();
  };

  const toggleGhost = () => {
    setIsGhostActive(!isGhostActive);
  };

  const toggleGameMode = () => {
    setGameMode(gameMode === 'standard' ? 'progressive' : 'standard');
    resetGame();
  };

  // If we're in progressive mode, apply difficulty modifiers
  useEffect(() => {
    if (gameMode === 'progressive' && round > 1) {
      // Progressive difficulty increases with rounds
      // This could be implemented with shorter allowed reaction times
      // or visual distractions that make it harder to focus
    }
  }, [round, gameMode]);

  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col overflow-hidden relative">
      {/* Scanline effect */}
      <div className="scanlines absolute inset-0 pointer-events-none"></div>
      
      <GameHeader 
        gameMode={gameMode} 
        toggleGameMode={toggleGameMode}
        isGhostActive={isGhostActive}
        toggleGhost={toggleGhost}
        resetScores={resetScores}
      />
      
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 gap-6 relative">
        <div className="w-full md:w-1/2 max-w-md">
          <ReactionTest
            gameState={gameState}
            currentTime={currentTime}
            round={round}
            bestScore={bestScore}
            gameMode={gameMode}
            handleClick={handleClick}
            startGame={startGame}
          />
        </div>
        
        <div className="w-full md:w-1/2 max-w-md flex flex-col gap-6">
          {isGhostActive && bestScoreTimeline.length > 0 && (
            <GhostReplay 
              bestScoreTimeline={bestScoreTimeline} 
              gameState={gameState} 
              currentTime={currentTime}
            />
          )}
          
          <ScoreBoard 
            scores={scores}
            bestScore={bestScore}
            averageScore={getAverageScore()}
            worstScore={getWorstScore()}
          />
        </div>
      </div>
      
      <GameFooter 
        gameState={gameState}
        currentTime={currentTime}
        nextRound={nextRound}
        resetGame={resetGame}
      />
    </div>
  );
};

export default Game;