import React, { useState, useEffect } from 'react';
import Cell from './Cell';

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

// Создаем начальную доску с случайными фруктами
const createInitialBoard = (rows: number, cols: number) => {
  const board = [];
  for (let i = 0; i < rows * cols; i++) {
    const randomIndex = Math.floor(Math.random() * fruits.length);
    board.push(fruits[randomIndex]);
  }
  return board;
};

const Match3Game: React.FC = () => {
  const rows = 8;
  const cols = 8;
  const [board, setBoard] = useState(createInitialBoard(rows, cols));
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [secondSelectedCell, setSecondSelectedCell] = useState<number | null>(null);
  const [matchedCells, setMatchedCells] = useState<number[]>([]);
  const [newCells, setNewCells] = useState<number[]>([]);
  const [fallingCells, setFallingCells] = useState<number[]>([]);
  const [highlightedCells, setHighlightedCells] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [fallDistances, setFallDistances] = useState<Record<number, number>>({});

  // Функция для перемешивания доски
  const shuffleBoard = () => {
    // Не перемешиваем, если уже идет анимация
    if (matchedCells.length > 0 || highlightedCells.length > 0 || isShuffling) return;

    setIsShuffling(true);
    setSelectedCell(null);

    // Создаем новую доску с случайными фруктами
    const newBoard = createInitialBoard(rows, cols);
    setBoard(newBoard);

    // Добавляем все ячейки в новые для анимации появления
    const allCells = Array.from({ length: rows * cols }, (_, i) => i);
    setNewCells(allCells);

    // Сбрасываем статус новых фруктов через время
    setTimeout(() => {
      setNewCells([]);
      setIsShuffling(false);

      // Проверяем совпадения в новой доске
      checkMatches(newBoard);
    }, 500);
  };

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

  // Функция для обмена фруктов местами
  const swapFruits = (index1: number, index2: number) => {
    const newBoard = [...board];
    const temp = newBoard[index1];
    newBoard[index1] = newBoard[index2];
    newBoard[index2] = temp;
    setBoard(newBoard);

    // После обмена проверяем совпадения
    checkMatches(newBoard);
  };

  // Функция для проверки совпадений по горизонтали и вертикали
  const checkMatches = (currentBoard: string[]) => {
    const matched: number[] = [];

    // Проверка горизонтальных совпадений
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 2; c++) {
        const index = r * cols + c;
        const fruit = currentBoard[index];

        if (fruit !== null &&
            fruit === currentBoard[index + 1] &&
            fruit === currentBoard[index + 2]) {
          matched.push(index, index + 1, index + 2);

          // Проверяем 4-й и 5-й фрукт в ряду
          if (c < cols - 3 && fruit === currentBoard[index + 3]) {
            matched.push(index + 3);
            if (c < cols - 4 && fruit === currentBoard[index + 4]) {
              matched.push(index + 4);
            }
          }
        }
      }
    }

    // Проверка вертикальных совпадений
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 2; r++) {
        const index = r * cols + c;
        const fruit = currentBoard[index];

        if (fruit !== null &&
            fruit === currentBoard[index + cols] &&
            fruit === currentBoard[index + cols * 2]) {
          matched.push(index, index + cols, index + cols * 2);

          // Проверяем 4-й и 5-й фрукт в столбце
          if (r < rows - 3 && fruit === currentBoard[index + cols * 3]) {
            matched.push(index + cols * 3);
            if (r < rows - 4 && fruit === currentBoard[index + cols * 4]) {
              matched.push(index + cols * 4);
            }
          }
        }
      }
    }

    // Удаляем дубликаты
    const uniqueMatched = [...new Set(matched)];

    if (uniqueMatched.length > 0) {
      // Сначала подсвечиваем ячейки на 1 секунду
      setHighlightedCells(uniqueMatched);

      // Затем добавляем анимацию исчезновения
      setTimeout(() => {
        setMatchedCells(uniqueMatched);
        setHighlightedCells([]); // Убираем подсветку

        // Удаляем совпавшие фрукты после анимации исчезновения
        setTimeout(() => {
          removeMatches(uniqueMatched, currentBoard);
        }, 300); // Уменьшено с 500мс до 300мс
      }, 800); // Уменьшено с 1000мс до 800мс для подсветки
    }
  };

  // Функция для удаления совпавших фруктов и заполнения пустот
  const removeMatches = (matchedIndices: number[], currentBoard: string[]) => {
    // Создаем копию доски
    const newBoard = [...currentBoard];
    const newFruits: number[] = [];
    const fallingCells: number[] = [];
    const fallingDistances: Record<number, number> = {};

    // Помечаем совпавшие ячейки как null
    matchedIndices.forEach((index) => {
      newBoard[index] = null as unknown as string;
    });

    // Перебираем каждый столбец
    for (let c = 0; c < cols; c++) {
      let emptyCount = 0;
      const emptyRows: number[] = [];

      // Сначала проходим снизу вверх и находим все пустые ячейки
      for (let r = rows - 1; r >= 0; r--) {
        const index = r * cols + c;
        if (newBoard[index] === null) {
          emptyCount++;
          emptyRows.push(r); // Запоминаем пустые строки
        }
      }

      // Если в столбце нет пустых ячеек, переходим к следующему
      if (emptyCount === 0) continue;

      // Снова проходим снизу вверх, перемещая фрукты вниз
      for (let r = rows - 1; r >= 0; r--) {
        const index = r * cols + c;

        // Если текущая ячейка пустая, ищем фрукт сверху для перемещения
        if (newBoard[index] === null) {
          // Найдем ближайший фрукт сверху
          let foundFruit = false;

          for (let above = r - 1; above >= 0; above--) {
            const aboveIndex = above * cols + c;

            if (newBoard[aboveIndex] !== null) {
              // Нашли фрукт - перемещаем его вниз
              newBoard[index] = newBoard[aboveIndex];
              newBoard[aboveIndex] = null as unknown as string;

              // Отмечаем эту ячейку как падающую
              fallingCells.push(index);

              // Рассчитываем дистанцию падения (разница в строках)
              fallingDistances[index] = r - above;

              foundFruit = true;
              break;
            }
          }

          // Если фрукт не найден, значит все пустые ячейки сверху
          if (!foundFruit) {
            // Создаем новый фрукт
            const randomIndex = Math.floor(Math.random() * fruits.length);
            newBoard[index] = fruits[randomIndex];
            newFruits.push(index);
          }
        }
      }
    }

    // Обновляем состояние
    setBoard(newBoard);
    setMatchedCells([]);
    setFallingCells(fallingCells);
    setFallDistances(fallingDistances);
    setNewCells(newFruits);

    // Сбрасываем анимации через время
    setTimeout(() => {
      setMatchedCells([]);
      setFallingCells([]);
      setNewCells([]);
      setFallDistances({});
    }, 600);

    // Проверяем новые совпадения
    setTimeout(() => {
      checkMatches(newBoard);
    }, 700);
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

  // Проверка начальных совпадений при первом рендере
  useEffect(() => {
    checkMatches(board);
  }, []);

  return (
    <div className="p-4 bg-amber-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-800">Match 3</h2>
        <button
          onClick={shuffleBoard}
          disabled={matchedCells.length > 0 || highlightedCells.length > 0 || isShuffling}
          className={`px-4 py-2 rounded-lg font-medium
                    ${(matchedCells.length > 0 || highlightedCells.length > 0 || isShuffling)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 cursor-pointer'}`}
        >
          Перемешать
        </button>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {board.map((fruit, index) => (
          <Cell
            key={index}
            index={index}
            fruit={fruit}
            bgColor={fruitBackgrounds[fruit] || 'bg-white/80'}
            isSelected={index === selectedCell || index === secondSelectedCell}
            isMatched={matchedCells.includes(index)}
            isNew={newCells.includes(index)}
            isFalling={fallingCells.includes(index)}
            isHighlighted={highlightedCells.includes(index)}
            fallDistance={fallDistances[index] || 1}
            onClick={() => handleCellClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Match3Game;