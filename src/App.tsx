import React, { useEffect, useState } from 'react';
import Match3Game from './components/Match3Game';
import backgroundMusic from './assets/background-music.mp3';
import djPepa from './assets/pepe-rave-rave-pepe.gif'

const App: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [audio] = useState(new Audio(backgroundMusic));
  const [key, setKey] = useState(0);

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
    };
  }, [audio]);

  const startGame = () => {
    if (!isGameStarted) {
      setIsGameStarted(true);
      audio.play().catch((error) => {
        console.error("Ошибка воспроизведения звука:", error);
      });
    } else {
      setKey(prevKey => prevKey + 1);
    }
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
            <img src={djPepa} alt="DJ Pepa" className='w-30 h-30' />
          </div>
          <Match3Game
            key={key}
            onScoreUpdate={(score) => {
              console.log('Текущий счет:', score);
            }}
          />
          <button
            onClick={startGame}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            Новая игра
          </button>
        </div>
      )}
    </div>
  );
};

export default App;