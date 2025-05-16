import { useState, useEffect } from 'react';

interface ScoreTimeline {
  timestamp: number;
  score: number;
}

const useScoreManager = () => {
  const [scores, setScores] = useState<number[]>([]);
  const [bestScoreTimeline, setBestScoreTimeline] = useState<ScoreTimeline[]>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);

  // Add a new score to the list
  const addScore = (score: number) => {
    // Don't add invalid scores (like early clicks)
    if (score < 0) return;
    
    const newScores = [...scores, score];
    setScores(newScores);

    // Update best score if this is better
    if (bestScore === null || score < bestScore) {
      setBestScore(score);
      
      // Record timeline for ghost replay
      const now = Date.now();
      const startTime = now - score;
      
      // Create a timeline with 5-10 intermediate points for smooth replay
      const timelinePoints = Math.floor(5 + Math.random() * 5);
      const newTimeline: ScoreTimeline[] = [];
      
      // Start point
      newTimeline.push({ timestamp: startTime, score: 0 });
      
      // Add some intermediate points to simulate user hesitation/movement
      for (let i = 1; i < timelinePoints; i++) {
        const progress = i / timelinePoints;
        const randomVariation = Math.random() * 0.2 - 0.1; // -10% to +10% variation
        const adjustedProgress = Math.max(0, Math.min(1, progress + randomVariation));
        
        newTimeline.push({
          timestamp: startTime + Math.floor(score * adjustedProgress),
          score: Math.floor(score * adjustedProgress)
        });
      }
      
      // End point
      newTimeline.push({ timestamp: now, score: score });
      
      setBestScoreTimeline(newTimeline);
    }
  };

  // Calculate the average score
  const getAverageScore = () => {
    if (scores.length === 0) return null;
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return Math.round(sum / scores.length);
  };

  // Get the worst score
  const getWorstScore = () => {
    if (scores.length === 0) return null;
    return Math.max(...scores);
  };

  // Reset all scores
  const resetScores = () => {
    setScores([]);
    setBestScore(null);
    setBestScoreTimeline([]);
  };

  return {
    scores,
    bestScore,
    addScore,
    getAverageScore,
    resetScores,
    getWorstScore,
    bestScoreTimeline,
  };
};

export default useScoreManager;