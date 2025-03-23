import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import ScoreDisplay from './ScoreDisplay';

interface Match3GameProps {
  onScoreUpdate: (score: number) => void;
}

const fruits = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍑', '🍍', '🥝'];

// Соответствие фруктов и цветов фона
const fruitBackgrounds: Record<string, string> = {
  '🍎': 'bg-red-300',    // Легкий красный для яблока
  '🍌': 'bg-yellow-300', // Легкий желтый для банана
  '🍇': 'bg-purple-300', // Легкий фиолетовый для винограда
  '🍊': 'bg-orange-400', // Легкий оранжевый для апельсина
  '🍓': 'bg-pink-200',   // Легкий розовый для клубники
  '🍑': 'bg-pink-200',   // Светлый розовый для персика (пришлось заменить на существующий цвет)
  '🍍': 'bg-yellow-200', // Светлый желтый для ананаса (пришлось заменить)
  '🥝': 'bg-green-200'   // Легкий зеленый для киви
};

const Match3Game: React.FC<Match3GameProps> = ({ onScoreUpdate }) => {
  const rows = 8;
  const cols = 8;
  const [board, setBoard] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [secondSelectedCell, setSecondSelectedCell] = useState<number | null>(null);
  const [matchedCells, setMatchedCells] = useState<number[]>([]);
  const [newCells, setNewCells] = useState<number[]>([]);
  const [fallingCells, setFallingCells] = useState<number[]>([]);
  const [highlightedCells, setHighlightedCells] = useState<number[]>([]);
  // const [isShuffling, setIsShuffling] = useState(false);
  const [fallDistances, setFallDistances] = useState<Record<number, number>>({});
  const [swappingCells, setSwappingCells] = useState<number[]>([]);
  const [swapDirections, setSwapDirections] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  // Функция для перемешивания доски
  // const shuffleBoard = () => {
  //   // Не перемешиваем, если уже идет анимация
  //   if (matchedCells.length > 0 || highlightedCells.length > 0 || isShuffling) return;

  //   setIsShuffling(true);
  //   setSelectedCell(null);

  //   // Создаем новую доску без совпадений
  //   const newBoard = createBoardWithoutMatches();
  //   setBoard(newBoard);

  //   // Добавляем все ячейки в новые для анимации
  //   const allCells = Array.from({ length: rows * cols }, (_, i) => i);
  //   setNewCells(allCells);

  //   // Сбрасываем статус новых фруктов через время
  //   setTimeout(() => {
  //     setNewCells([]);
  //     setIsShuffling(false);

  //     // Проверяем совпадения в новой доске
  //     checkMatches(newBoard);
  //   }, 500);
  // };

  // Функция проверки соседних ячеек
  const areAdjacent = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / cols);
    const col1 = index1 % cols;
    const row2 = Math.floor(index2 / cols);
    const col2 = index2 % cols;

    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  };

  // Добавим новую функцию для проверки возможных совпадений
  const findMatches = (currentBoard: string[][]) => {
    const matched: number[] = [];

    // Проверка горизонтальных совпадений
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 2; c++) {
        const fruit = currentBoard[r][c];
        if (
          fruit &&
          fruit === currentBoard[r][c + 1] &&
          fruit === currentBoard[r][c + 2]
        ) {
          matched.push(r * cols + c, r * cols + c + 1, r * cols + c + 2);
        }
      }
    }

    // Проверка вертикальных совпадений
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 2; r++) {
        const fruit = currentBoard[r][c];
        if (
          fruit &&
          fruit === currentBoard[r + 1][c] &&
          fruit === currentBoard[r + 2][c]
        ) {
          matched.push(r * cols + c, (r + 1) * cols + c, (r + 2) * cols + c);
        }
      }
    }

    return [...new Set(matched)];
  };

  // Добавим функцию для проверки возможности хода
  const isValidSwap = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / cols);
    const col1 = index1 % cols;
    const row2 = Math.floor(index2 / cols);
    const col2 = index2 % cols;

    // Создаем копию доски для проверки
    const testBoard = board.map(row => [...row]);

    // Меняем фрукты местами
    const temp = testBoard[row1][col1];
    testBoard[row1][col1] = testBoard[row2][col2];
    testBoard[row2][col2] = temp;

    // Проверяем, появились ли совпадения после обмена
    const matches = findMatches(testBoard);

    return matches.length > 0;
  };

  // Модифицируем функцию swapFruits
  const swapFruits = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / cols);
    const col1 = index1 % cols;
    const row2 = Math.floor(index2 / cols);
    const col2 = index2 % cols;

    // Определяем направление свапа
    let direction1, direction2;
    if (row1 === row2) {
      direction1 = col1 < col2 ? 'right' : 'left';
      direction2 = col1 < col2 ? 'left' : 'right';
    } else {
      direction1 = row1 < row2 ? 'down' : 'up';
      direction2 = row1 < row2 ? 'up' : 'down';
    }

    // Создаем копию доски для проверки
    const testBoard = board.map(row => [...row]);
    const temp = testBoard[row1][col1];
    testBoard[row1][col1] = testBoard[row2][col2];
    testBoard[row2][col2] = temp;

    // Проверяем, создает ли своп совпадение
    if (!isValidSwap(row1 * cols + col1, row2 * cols + col2)) {
      // Если своп не создает совпадение, показываем анимацию отмены
      setSwappingCells([index1, index2]);
      setSwapDirections({
        [index1]: `invalid_${direction1}`,
        [index2]: `invalid_${direction2}`
      });

      setTimeout(() => {
        setSwappingCells([]);
        setSwapDirections({});
        setSelectedCell(null);
        setSecondSelectedCell(null);
      }, 800);
      return;
    }

    // Если своп создает совпадение
    setSwappingCells([index1, index2]);
    setSwapDirections({
      [index1]: direction1,
      [index2]: direction2
    });

    // Меняем фрукты местами после анимации
    setTimeout(() => {
      const newBoard = board.map(row => [...row]);
      const temp = newBoard[row1][col1];
      newBoard[row1][col1] = newBoard[row2][col2];
      newBoard[row2][col2] = temp;

      setBoard(newBoard);
      setSwappingCells([]);
      setSwapDirections({});
      setSelectedCell(null);
      setSecondSelectedCell(null);

      // Проверяем совпадения после свапа
      checkMatches(newBoard);
    }, 400);
  };

  // Функция для проверки совпадений по горизонтали и вертикали
  const checkMatches = (currentBoard: string[][]) => {
    const matched: number[] = [];

    // Проверка горизонтальных совпадений
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 2; c++) {
        const fruit = currentBoard[r][c];
        if (
          fruit &&
          fruit === currentBoard[r][c + 1] &&
          fruit === currentBoard[r][c + 2]
        ) {
          matched.push(r * cols + c, r * cols + c + 1, r * cols + c + 2);
        }
      }
    }

    // Проверка вертикальных совпадений
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 2; r++) {
        const fruit = currentBoard[r][c];
        if (
          fruit &&
          fruit === currentBoard[r + 1][c] &&
          fruit === currentBoard[r + 2][c]
        ) {
          matched.push(r * cols + c, (r + 1) * cols + c, (r + 2) * cols + c);
        }
      }
    }

    // Удаляем дубликаты
    const uniqueMatched = [...new Set(matched)];

    if (uniqueMatched.length > 0) {
      setScore(prev => prev + uniqueMatched.length);
      setHighlightedCells(uniqueMatched);

      setTimeout(() => {
        setMatchedCells(uniqueMatched);
        setHighlightedCells([]);

        setTimeout(() => {
          removeMatches(uniqueMatched, currentBoard);
        }, 300);
      }, 800);
    }
  };

  // Функция для удаления совпавших фруктов и заполнения пустот
  const removeMatches = (matchedIndices: number[], currentBoard: string[][]) => {
    const newBoard = currentBoard.map(row => [...row]);
    const newFruits: number[] = [];
    const fallingCells: number[] = [];
    const fallingDistances: Record<number, number> = {};

    // Помечаем совпавшие ячейки как null
    matchedIndices.forEach((index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      newBoard[row][col] = null as unknown as string;
    });

    // Обрабатываем каждый столбец
    for (let c = 0; c < cols; c++) {
      let emptySpaces = 0;

      // Подсчитываем пустые ячейки снизу вверх
      for (let r = rows - 1; r >= 0; r--) {
        if (newBoard[r][c] === null) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          // Перемещаем фрукт вниз
          const newRow = r + emptySpaces;
          newBoard[newRow][c] = newBoard[r][c];
          newBoard[r][c] = null as unknown as string;
          fallingCells.push(newRow * cols + c);
          fallingDistances[newRow * cols + c] = emptySpaces;
        }
      }

      // Заполняем пустые ячейки сверху новыми фруктами
      for (let r = emptySpaces - 1; r >= 0; r--) {
        const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
        newBoard[r][c] = randomFruit;
        newFruits.push(r * cols + c);
      }
    }

    setBoard(newBoard);
    setMatchedCells([]);
    setFallingCells(fallingCells);
    setFallDistances(fallingDistances);
    setNewCells(newFruits);

    // Проверяем новые совпадения после задержки
    setTimeout(() => {
      setFallingCells([]);
      setNewCells([]);
      setFallDistances({});
      checkMatches(newBoard);
    }, 600);
  };

  // Обработчик клика по ячейке
  const handleCellClick = (index: number) => {
    // Не позволяем выбирать, если есть совпадения или подсветка
    if (matchedCells.length > 0 || highlightedCells.length > 0) return;

    if (selectedCell === null) {
      // Первый выбор
      setSelectedCell(index);
    } else if (selectedCell === index) {
      // Отмена выбора
      setSelectedCell(null);
    } else {
      // Второй выбор
      setSecondSelectedCell(index);

      // Проверка, являются ли ячейки соседними
      if (areAdjacent(selectedCell, index)) {
        // Обмен фруктов
        swapFruits(selectedCell, index);

        // Сбрасываем выбранные ячейки
        setSelectedCell(null);
        setSecondSelectedCell(null);
      } else {
        // Если ячейки не соседние, меняем первый выбор на текущий
        setSelectedCell(index);
      }
    }
  };

  // Функция для проверки совпадений на доске
  const hasMatches = (board: string[][]): boolean => {
    // Проверка горизонтальных совпадений
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length - 2; j++) {
        if (board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2]) {
          return true;
        }
      }
    }

    // Проверка вертикальных совпадений
    for (let i = 0; i < board.length - 2; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j]) {
          return true;
        }
      }
    }

    return false;
  };

  // Функция для создания доски без совпадений
  const createBoardWithoutMatches = () => {
    let newBoard: string[][];

    do {
      newBoard = Array(8).fill(null).map(() =>
        Array(8).fill(null).map(() =>
          fruits[Math.floor(Math.random() * fruits.length)]
        )
      );
    } while (hasMatches(newBoard));

    return newBoard;
  };

  // Инициализация игры
  const initializeGame = () => {
    setLoading(true);
    const newBoard = createBoardWithoutMatches();
    setBoard(newBoard);
    setScore(0);
    onScoreUpdate(0);
    setLoading(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Обновление счета
  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="text-xl">Загрузка игрового поля...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-amber-100 rounded-lg shadow-lg">
      <ScoreDisplay score={score} />
      {/* <button
        onClick={shuffleBoard}
        className="mb-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
      >
        Перемешать
      </button> */}
      <div className="grid grid-cols-8 gap-2">
        {board.map((row, i) =>
          row.map((fruit, j) => (
            <Cell
              key={`${i}-${j}`}
              fruit={fruit}
              bgColor={fruitBackgrounds[fruit] || 'bg-white/80'}
              isSelected={i * 8 + j === selectedCell || i * 8 + j === secondSelectedCell}
              isMatched={matchedCells.includes(i * 8 + j)}
              isNew={newCells.includes(i * 8 + j)}
              isFalling={fallingCells.includes(i * 8 + j)}
              isHighlighted={highlightedCells.includes(i * 8 + j)}
              isSwapping={swappingCells.includes(i * 8 + j)}
              swapDirection={swapDirections[i * 8 + j] as 'left' | 'right' | 'up' | 'down'}
              fallDistance={fallDistances[i * 8 + j] || 1}
              onClick={() => handleCellClick(i * 8 + j)}
              index={i * 8 + j}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Match3Game;