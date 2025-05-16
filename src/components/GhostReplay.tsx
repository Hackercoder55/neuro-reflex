import React, { useEffect, useState } from 'react';
import { Ghost } from 'lucide-react';

interface ScoreTimeline {
  timestamp: number;
  score: number;
}

interface GhostReplayProps {
  bestScoreTimeline: ScoreTimeline[];
  gameState: 'idle' | 'ready' | 'waiting' | 'click' | 'results';
  currentTime: number | null;
}

const GhostReplay: React.FC<GhostReplayProps> = ({
  bestScoreTimeline,
  gameState,
  currentTime
}) => {
  const [replayProgress, setReplayProgress] = useState<number>(0);
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [replayStartTime, setReplayStartTime] = useState<number | null>(null);
  const [replayTimer, setReplayTimer] = useState<number | null>(null);

  // Get the best score from the timeline
  const bestScore = bestScoreTimeline.length > 0 ? 
    bestScoreTimeline[bestScoreTimeline.length - 1].score : null;

  // Start replay when game state changes to 'click'
  useEffect(() => {
    if (gameState === 'click' && bestScoreTimeline.length > 0) {
      // Start the ghost replay
      setIsReplaying(true);
      setReplayProgress(0);
      setReplayStartTime(Date.now());
    }
    
    // Stop the replay if we're back to idle or results
    if (['idle', 'results'].includes(gameState)) {
      setIsReplaying(false);
      setReplayProgress(0);
      if (replayTimer !== null) {
        clearInterval(replayTimer);
        setReplayTimer(null);
      }
    }
  }, [gameState, bestScoreTimeline]);

  // Handle the replay animation
  useEffect(() => {
    if (isReplaying && replayStartTime && bestScore) {
      // Clear any existing timer
      if (replayTimer !== null) {
        clearInterval(replayTimer);
      }
      
      // Set up a timer to update the progress
      const timer = window.setInterval(() => {
        const elapsed = Date.now() - replayStartTime;
        
        if (elapsed >= bestScore) {
          // Replay complete
          setReplayProgress(100);
          setIsReplaying(false);
          clearInterval(timer);
        } else {
          // Find the appropriate point in the timeline
          const progress = (elapsed / bestScore) * 100;
          setReplayProgress(progress);
        }
      }, 16); // ~60fps update
      
      setReplayTimer(timer);
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [isReplaying, replayStartTime, bestScore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (replayTimer !== null) {
        clearInterval(replayTimer);
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-4
                   shadow-[0_0_15px_rgba(139,92,246,0.5)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Ghost className="w-5 h-5 text-purple-400 mr-2" />
          <h2 className="text-xl font-bold text-purple-400 font-mono tracking-wider">GHOST REPLAY</h2>
        </div>
        {bestScore && (
          <span className="text-sm text-purple-300 font-mono">{bestScore} ms</span>
        )}
      </div>
      
      {!bestScore ? (
        <div className="text-center py-6 text-gray-400">
          <Ghost className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No best time recorded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative h-6 bg-gray-800 rounded overflow-hidden">
            <div 
              className="absolute h-full bg-purple-600 transition-all duration-100 ease-linear"
              style={{ width: `${replayProgress}%` }}
            />
            <div 
              className={`absolute top-0 right-0 h-full w-2 bg-white ${isReplaying ? 'opacity-100' : 'opacity-0'}`}
              style={{ transform: `translateX(${replayProgress}%)` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400 font-mono">
            <span>0 ms</span>
            <span>{bestScore} ms</span>
          </div>
          
          <div className="text-center">
            {gameState === 'click' ? (
              isReplaying ? (
                <span className="text-purple-400 font-mono animate-pulse">Ghost competing...</span>
              ) : (
                <span className="text-purple-400 font-mono">Ghost finished!</span>
              )
            ) : (
              <span className="text-gray-400 font-mono">Start new round to race the ghost</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GhostReplay;