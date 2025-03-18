import React from 'react';
// import { Match } from '../types/match3Types';

interface CandyCellProps {
  type: string | null;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: (row: number, col: number) => void;
}

const CandyCell: React.FC<CandyCellProps> = ({ type, row, col, isSelected, onClick }) => {
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center text-2xl cursor-pointer border border-gray-300 ${
        isSelected ? 'bg-blue-200' : 'bg-white'
      }`}
      onClick={() => onClick(row, col)}
    >
      {type}
    </div>
  );
};

export default CandyCell;