import React from 'react';
import GameBoard from './GameBoard';
import ScoreDisplay from './ScoreDisplay';
import useMatch3Game from '../hooks/useMatch3Game';

const Match3Game: React.FC = () => {
  const { board, selectedCandy, score, handleCandyClick, initializeBoard } = useMatch3Game();

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Игра "3 в ряд"</h1>
      <ScoreDisplay score={score} />

      <GameBoard
        board={board}
        selectedCandy={selectedCandy}
        onCandyClick={handleCandyClick}
      />

      <button
        className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-blue-600"
        onClick={initializeBoard}
      >
        Новая игра
      </button>
    </div>
  );
};

export default Match3Game;