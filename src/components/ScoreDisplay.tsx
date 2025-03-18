import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return <div className="mb-4 text-lg">Счет: {score}</div>;
};

export default ScoreDisplay;