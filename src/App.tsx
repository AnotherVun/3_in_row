import React, { useEffect, useState } from 'react';
import Match3Game from './components/Match3Game';
import backgroundMusic from './assets/background-music.mp3';
import djPepa from './assets/pepe-rave-rave-pepe.gif'

const App: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [audio] = useState(new Audio(backgroundMusic));
  const [score, setScore] = useState(0);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [key, setKey] = useState(0);

  const playMusic = () => {
    if (isMusicEnabled) {
      audio.loop = true;
      audio.play();
    }
  };

  const toggleMusic = () => {
    setIsMusicEnabled(prev => !prev);
  };

  useEffect(() => {
    if (isMusicEnabled) {
      audio.loop = true;
      audio.play();
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [isMusicEnabled, audio]);

  const startGame = () => {
    if (!isGameStarted) {
      setIsGameStarted(true);
      audio.play().catch((error) => {
        console.error("Ошибка воспроизведения звука:", error);
      });
    } else {
      setKey(prevKey => prevKey + 1);
    }
    setScore(0);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-300">
      {!isGameStarted ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8 text-amber-800">Match 3</h1>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg text-xl hover:bg-amber-700 transition-colors"
          >
            Новая игра
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-amber-800 flex justify-center" >
            <img src={djPepa} alt="" className='w-30 h-30' />
            {/* Счет: {score} */}
          </div>
          <Match3Game
            key={key}
            onScoreUpdate={setScore}
          />
          <button
            onClick={startGame}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            Новая игра
          </button>
        </div>
      )}
      {/* <div className="relative">
        <button
          onClick={() => setIsMenuOpen(prev => !prev)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Настройки
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
            <div className="p-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isMusicEnabled}
                  onChange={toggleMusic}
                  className="mr-2"
                />
                Включить музыку
              </label>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default App;