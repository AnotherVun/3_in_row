import React from 'react';
import { motion } from 'framer-motion';

interface CellProps {
  fruit: string;
  bgColor: string;
  isSelected: boolean;
  isMatched: boolean;
  isNew: boolean;
  isFalling: boolean;
  isHighlighted: boolean;
  isSwapping: boolean;
  swapDirection?: string;
  fallDistance: number;
  onClick: () => void;
  index: number;
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
  isSwapping = false,
  swapDirection = 'right',
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

  // Обновляем функцию getSwapAnimation
  const getSwapAnimation = () => {
    const distance = 48; // размер ячейки

    // Добавляем проверку на isInvalidSwap
    const isInvalidSwap = swapDirection.startsWith('invalid_');
    // Убираем префикс invalid_ из направления если он есть
    const direction = isInvalidSwap ? swapDirection.replace('invalid_', '') : swapDirection;

    const getInvalidAnimation = () => {
      const shakeKeyframes = {
        scale: [1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1],
        rotate: [-2, 2, -2, 2, -1, 1, -1, 0]
      };

      switch (direction) {
        case 'left': return {
          initial: { x: 0, scale: 1 },
          animate: {
            scale: shakeKeyframes.scale,
            rotate: shakeKeyframes.rotate,
            x: [0, -24, -24, -24, -24, -24, -24, -24, 0]
          }
        };
        case 'right': return {
          initial: { x: 0, scale: 1 },
          animate: {
            scale: shakeKeyframes.scale,
            rotate: shakeKeyframes.rotate,
            x: [0, 24, 24, 24, 24, 24, 24, 24, 0]
          }
        };
        case 'up': return {
          initial: { y: 0, scale: 1 },
          animate: {
            scale: shakeKeyframes.scale,
            rotate: shakeKeyframes.rotate,
            y: [0, -24, -24, -24, -24, -24, -24, -24, 0]
          }
        };
        case 'down': return {
          initial: { y: 0, scale: 1 },
          animate: {
            scale: shakeKeyframes.scale,
            rotate: shakeKeyframes.rotate,
            y: [0, 24, 24, 24, 24, 24, 24, 24, 0]
          }
        };
        default: return {
          initial: { x: 0, y: 0, scale: 1 },
          animate: { x: 0, y: 0, scale: 1 }
        };
      }
    };

    if (isInvalidSwap) {
      return getInvalidAnimation();
    }

    // Обновляем анимацию валидного обмена
    switch (direction) {
      case 'left': return {
        initial: { x: 0, y: 0, scale: 1, zIndex: 1 },
        animate: {
          x: [0, -24, -48],
          y: [0, -24, 0],
          scale: [1, 1.1, 1],
          zIndex: [1, 2, 1]
        }
      };
      case 'right': return {
        initial: { x: 0, y: 0, scale: 1, zIndex: 1 },
        animate: {
          x: [0, 24, 48],
          y: [0, -24, 0],
          scale: [1, 1.1, 1],
          zIndex: [1, 2, 1]
        }
      };
      case 'up': return {
        initial: { x: 0, y: 0, scale: 1, zIndex: 1 },
        animate: {
          y: [0, -24, -48],
          x: [0, 12, 0],
          scale: [1, 1.1, 1],
          zIndex: [1, 2, 1]
        }
      };
      case 'down': return {
        initial: { x: 0, y: 0, scale: 1, zIndex: 1 },
        animate: {
          y: [0, 24, 48],
          x: [0, -12, 0],
          scale: [1, 1.1, 1],
          zIndex: [1, 2, 1]
        }
      };
      default: return {
        initial: { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 1 },
        animate: { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 1 }
      };
    }
  };

  return (
    <div
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center rounded-lg
                 ${isHighlighted ? 'bg-purple-500' : bgColor}
                 shadow-md cursor-pointer relative`}
    >
      {isSwapping ? (
        <motion.div
          key={`swapping-${index}`}
          className="text-2xl absolute"
          style={{
            fontSize: '24px',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: 'center'
          }}
          {...getSwapAnimation()}
          transition={{
            duration: swapDirection.startsWith('invalid_') ? 0.8 : 0.4,
            times: swapDirection.startsWith('invalid_')
              ? [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1]
              : [0, 0.5, 1],
            ease: swapDirection.startsWith('invalid_')
              ? "easeInOut"
              : [0.25, 0.1, 0.25, 1]
          }}
        >
          {fruit}
        </motion.div>
      ) : isFalling ? (
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
            justifyContent: 'center',
            opacity: 0
          }}
          initial={{ top: '-120px', opacity: 0 }}
          animate={{ top: 0, opacity: 1 }}
          transition={{
            top: {
              ...fallAnimationProps,
              delay: 0.2 + (Math.floor(index / cols) * 0.05)
            },
            opacity: {
              duration: 0.2,
              delay: 0.3 + (Math.floor(index / cols) * 0.05)
            }
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