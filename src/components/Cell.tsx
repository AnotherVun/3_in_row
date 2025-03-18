import React from 'react';
import { motion } from 'framer-motion';

interface CellProps {
  fruit: string;
  onClick: () => void;
  bgColor: string;
  isSelected?: boolean;
  isMatched?: boolean;
  isNew?: boolean;
  isFalling?: boolean;
  isHighlighted?: boolean;
  index: number;
  fallDistance?: number;
}

const Cell: React.FC<CellProps> = ({
  fruit,
  onClick,
  bgColor,
  isSelected = false,
  isMatched = false,
  isNew = false,
  isFalling = false,
  isHighlighted = false,
  index,
  fallDistance = 1
}) => {
  // Определяем константу cols внутри компонента
  const cols = 8; // Предполагая, что в вашей игре 8 столбцов

  // Общие параметры анимации падения для обоих типов фруктов
  const fallAnimationProps = {
    type: "spring" as const,
    stiffness: 100,
    damping: 10,
    mass: 0.6,
    velocity: 2,
    duration: 0.7,
    ease: "easeOut" as const
  };

  return (
    <div
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center rounded-lg
                 ${isHighlighted ? 'bg-purple-500' : bgColor}
                 shadow-md cursor-pointer relative`}
    >
      {isFalling ? (
        <motion.div
          key={`falling-${index}`}
          className="text-2xl absolute"
          style={{
            fontSize: '24px',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          initial={{ top: `-${48 * fallDistance}px` }}
          animate={{ top: 0 }}
          transition={{
            ...fallAnimationProps,
            delay: 0.1
          }}
        >
          {fruit}
        </motion.div>
      ) : isMatched ? (
        <motion.div
          key={`matched-${index}`}
          className="text-2xl"
          style={{ fontSize: '24px' }}
          animate={{ scale: [1, 1.1, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.5 }}
        >
          {fruit}
        </motion.div>
      ) : isNew ? (
        <motion.div
          key={`new-${index}`}
          className="text-2xl absolute"
          style={{
            fontSize: '24px',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          initial={{ top: '-120px' }}
          animate={{ top: 0 }}
          transition={{
            ...fallAnimationProps,
            delay: 0.2 + (Math.floor(index / cols) * 0.05)
          }}
        >
          {fruit}
        </motion.div>
      ) : (
        <motion.div
          key={`normal-${index}`}
          className="text-2xl"
          style={{ fontSize: '24px' }}
          animate={isSelected ? {
            y: [0, -8, 0],
            transition: {
              y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
            }
          } : {}}
        >
          {fruit}
        </motion.div>
      )}
    </div>
  );
};

export default Cell;