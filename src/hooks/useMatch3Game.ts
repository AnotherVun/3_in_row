import { useState, useEffect } from 'react';
import { Candy, Match } from '../types/match3Types';
import { CANDY_TYPES, BOARD_SIZE, MATCH_DELAY, CASCADE_DELAY } from '../constants/gameConstants';

const useMatch3Game = () => {
  const [board, setBoard] = useState<Candy[][]>([]);
  const [selectedCandy, setSelectedCandy] = useState<Match | null>(null);
  const [score, setScore] = useState<number>(0);

  // Инициализация игровой доски
  const initializeBoard = () => {
    const newBoard: Candy[][] = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      const row: Candy[] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        // Выбираем случайную фигуру
        const randomType = Math.floor(Math.random() * CANDY_TYPES.length);
        row.push({
          type: CANDY_TYPES[randomType],
          row: i,
          col: j
        });
      }
      newBoard.push(row);
    }

    // Проверяем начальные совпадения
    const boardWithoutMatches = removeInitialMatches(newBoard);
    setBoard(boardWithoutMatches);
    setScore(0);
  };

  // Функция проверки и удаления начальных совпадений
  const removeInitialMatches = (board: Candy[][]): Candy[][] => {
    const newBoard = [...board];
    let hasMatches = true;

    // Пытаемся избежать совпадений при инициализации
    while (hasMatches) {
      hasMatches = false;

      // Проверяем горизонтальные совпадения
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE - 2; j++) {
          if (
            newBoard[i][j].type === newBoard[i][j + 1].type &&
            newBoard[i][j].type === newBoard[i][j + 2].type
          ) {
            // Заменяем среднюю фигуру на случайную другую
            const currentType = newBoard[i][j].type;
            let newType;
            do {
              const randomType = Math.floor(Math.random() * CANDY_TYPES.length);
              newType = CANDY_TYPES[randomType];
            } while (newType === currentType);

            newBoard[i][j + 1] = {
              ...newBoard[i][j + 1],
              type: newType
            };
            hasMatches = true;
          }
        }
      }

      // Проверяем вертикальные совпадения
      for (let i = 0; i < BOARD_SIZE - 2; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (
            newBoard[i][j].type === newBoard[i + 1][j].type &&
            newBoard[i][j].type === newBoard[i + 2][j].type
          ) {
            // Заменяем среднюю фигуру на случайную другую
            const currentType = newBoard[i][j].type;
            let newType;
            do {
              const randomType = Math.floor(Math.random() * CANDY_TYPES.length);
              newType = CANDY_TYPES[randomType];
            } while (newType === currentType);

            newBoard[i + 1][j] = {
              ...newBoard[i + 1][j],
              type: newType
            };
            hasMatches = true;
          }
        }
      }
    }

    return newBoard;
  };

  // Обработчик клика по фигуре
  const handleCandyClick = (row: number, col: number) => {
    // Если фигура не выбрана, выбираем ее
    if (!selectedCandy) {
      setSelectedCandy({ row, col });
      return;
    }

    // Проверяем, соседние ли фигуры
    const isAdjacent =
      (Math.abs(selectedCandy.row - row) === 1 && selectedCandy.col === col) ||
      (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row);

    if (isAdjacent) {
      // Пробуем поменять местами
      swapCandies(selectedCandy.row, selectedCandy.col, row, col);
    } else {
      // Если не соседние, просто выбираем новую фигуру
      setSelectedCandy({ row, col });
    }
  };

  // Функция для обмена фигур местами
  const swapCandies = (row1: number, col1: number, row2: number, col2: number) => {
    // Создаем копию доски
    const newBoard = [...board];

    // Сохраняем значения фигур
    const candy1 = { ...newBoard[row1][col1] };
    const candy2 = { ...newBoard[row2][col2] };

    // Меняем местами
    newBoard[row1][col1] = { ...candy2, row: row1, col: col1 };
    newBoard[row2][col2] = { ...candy1, row: row2, col: col2 };

    // Проверяем, образуется ли совпадение
    const matches = findMatches(newBoard);

    if (matches.length > 0) {
      // Обновляем доску с обменом
      setBoard(newBoard);

      // Сбрасываем выбранную фигуру
      setSelectedCandy(null);

      // Обрабатываем совпадения
      setTimeout(() => {
        handleMatches(matches);
      }, MATCH_DELAY);
    } else {
      // Если совпадений нет, отменяем обмен
      setSelectedCandy(null);
    }
  };

  // Функция поиска совпадений
  const findMatches = (board: Candy[][]): Match[] => {
    const matches: Match[] = [];

    // Проверяем горизонтальные совпадения
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE - 2; j++) {
        if (
          board[i][j].type === board[i][j + 1].type &&
          board[i][j].type === board[i][j + 2].type
        ) {
          // Добавляем совпадающие фигуры
          matches.push({ row: i, col: j });
          matches.push({ row: i, col: j + 1 });
          matches.push({ row: i, col: j + 2 });

          // Проверяем, можно ли продлить совпадение
          if (j + 3 < BOARD_SIZE && board[i][j].type === board[i][j + 3].type) {
            matches.push({ row: i, col: j + 3 });

            if (j + 4 < BOARD_SIZE && board[i][j].type === board[i][j + 4].type) {
              matches.push({ row: i, col: j + 4 });
            }
          }
        }
      }
    }

    // Проверяем вертикальные совпадения
    for (let i = 0; i < BOARD_SIZE - 2; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (
          board[i][j].type === board[i + 1][j].type &&
          board[i][j].type === board[i + 2][j].type
        ) {
          // Добавляем совпадающие фигуры
          matches.push({ row: i, col: j });
          matches.push({ row: i + 1, col: j });
          matches.push({ row: i + 2, col: j });

          // Проверяем, можно ли продлить совпадение
          if (i + 3 < BOARD_SIZE && board[i][j].type === board[i + 3][j].type) {
            matches.push({ row: i + 3, col: j });

            if (i + 4 < BOARD_SIZE && board[i][j].type === board[i + 4][j].type) {
              matches.push({ row: i + 4, col: j });
            }
          }
        }
      }
    }

    // Убираем дубликаты
    const uniqueMatches: Match[] = [];
    matches.forEach(match => {
      if (!uniqueMatches.some(m => m.row === match.row && m.col === match.col)) {
        uniqueMatches.push(match);
      }
    });

    return uniqueMatches;
  };

  // Обработка совпадений
  const handleMatches = (matches: Match[]) => {
    if (matches.length === 0) return;

    // Обновляем счет
    setScore(prevScore => prevScore + matches.length);

    // Создаем копию доски
    let newBoard = [...board];

    // Отмечаем совпадающие фигуры как пустые
    matches.forEach(match => {
      newBoard[match.row][match.col] = { ...newBoard[match.row][match.col], type: null };
    });

    // Применяем эффект гравитации и добавляем новые фигуры
    newBoard = applyGravity(newBoard);

    // Обновляем доску
    setBoard(newBoard);

    // Проверяем наличие новых совпадений
    setTimeout(() => {
      const newMatches = findMatches(newBoard);
      if (newMatches.length > 0) {
        handleMatches(newMatches);
      }
    }, CASCADE_DELAY);
  };

  // Функция для применения гравитации и добавления новых фигур
  const applyGravity = (board: Candy[][]): Candy[][] => {
    const newBoard = [...board];

    // Для каждого столбца
    for (let j = 0; j < BOARD_SIZE; j++) {
      // Считаем количество пустых ячеек
      let emptyCount = 0;

      // Движемся снизу вверх
      for (let i = BOARD_SIZE - 1; i >= 0; i--) {
        if (newBoard[i][j].type === null) {
          // Увеличиваем счетчик пустых ячеек
          emptyCount++;
        } else if (emptyCount > 0) {
          // Перемещаем непустую ячейку вниз
          newBoard[i + emptyCount][j] = {
            ...newBoard[i][j],
            row: i + emptyCount
          };

          // Освобождаем текущую ячейку
          newBoard[i][j] = { ...newBoard[i][j], type: null };
        }
      }

      // Добавляем новые фигуры сверху
      for (let i = 0; i < emptyCount; i++) {
        const randomType = Math.floor(Math.random() * CANDY_TYPES.length);
        newBoard[i][j] = {
          type: CANDY_TYPES[randomType],
          row: i,
          col: j
        };
      }
    }

    return newBoard;
  };

  // Инициализируем игру при первой загрузке
  useEffect(() => {
    initializeBoard();
  }, []);

  return {
    board,
    selectedCandy,
    score,
    handleCandyClick,
    initializeBoard
  };
};

export default useMatch3Game;