import React from 'react';
import Match3Game from './components/Match3Game';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-amber-300">
      <Match3Game />
    </div>
  );
};

export default App;