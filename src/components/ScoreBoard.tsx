import React from 'react';
import { Trophy, Clock, BarChart } from 'lucide-react';

interface ScoreBoardProps {
  scores: number[];
  bestScore: number | null;
  averageScore: number | null;
  worstScore: number | null;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  bestScore,
  averageScore,
  worstScore
}) => {
  return (
    <div className="bg-gray-900 border-2 border-indigo-500 rounded-lg p-4
                    shadow-[0_0_15px_rgba(99,102,241,0.5)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-indigo-400 font-mono tracking-wider">NEURAL METRICS</h2>
        <span className="text-sm text-indigo-300 font-mono">
          {scores.length} {scores.length === 1 ? 'test' : 'tests'} completed
        </span>
      </div>
      
      {scores.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <BarChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No data recorded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-gray-300">Best Time</span>
            </div>
            <span className="text-xl font-bold text-yellow-400 font-mono">{bestScore} ms</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="text-gray-300">Average</span>
            </div>
            <span className="text-xl font-bold text-cyan-400 font-mono">{averageScore} ms</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-gray-300">Worst</span>
            </div>
            <span className="text-xl font-bold text-red-400 font-mono">{worstScore} ms</span>
          </div>
          
          {/* Last 5 scores */}
          <div className="mt-4">
            <h3 className="text-sm text-gray-400 mb-2 font-mono">RECENT RESULTS</h3>
            <div className="grid grid-cols-5 gap-1">
              {[...scores].reverse().slice(0, 5).map((score, index) => (
                <div key={index} className="bg-gray-800 p-2 rounded text-center">
                  <span className="text-xs text-gray-400 block">#{scores.length - index}</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">{score}</span>
                </div>
              ))}
              {Array(Math.max(0, 5 - scores.length)).fill(0).map((_, index) => (
                <div key={`empty-${index}`} className="bg-gray-800 p-2 rounded text-center opacity-30">
                  <span className="text-xs text-gray-500 block">-</span>
                  <span className="text-sm font-bold text-gray-500 font-mono">---</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;