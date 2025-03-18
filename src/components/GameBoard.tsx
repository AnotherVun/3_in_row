import React from 'react';
import CandyCell from './CandyCell';
import { Candy, Match } from '../types/match3Types';

interface GameBoardProps {
  board: Candy[][];
  selectedCandy: Match | null;
  onCandyClick: (row: number, col: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, selectedCandy, onCandyClick }) => {
  return (
    <div className="border-4 rounded p-2 bg-gray-100">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((candy, colIndex) => (
            <CandyCell
              key={colIndex}
              type={candy.type}
              row={rowIndex}
              col={colIndex}
              isSelected={selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex}
              onClick={onCandyClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
