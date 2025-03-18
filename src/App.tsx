import React, { useEffect, useState } from 'react';
import Match3Game from './components/Match3Game';
import backgroundMusic from './assets/background-music.mp3';

const App: React.FC = () => {
  const [audio] = useState(new Audio(backgroundMusic));
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-300">
      <div className="relative">
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
      </div>
      <Match3Game />
    </div>
  );
};

export default App;