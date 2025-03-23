import React from "react";
import dancePepa from "../assets/pepe-the-frog-pepe.gif";
import drumPepa from '../assets/pepe-drum-peepo-drum.gif'

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <img
        src={drumPepa}
        alt="Dancing Pepe"
        className="w-20 h-20"
      />
      <div className="text-2xl font-bold text-amber-800">
        Счет: {score}
      </div>
      <img
        src={dancePepa}
        alt="Dancing Pepe"
        className="w-25 h-16"
      />
    </div>
  );
};

export default ScoreDisplay;
