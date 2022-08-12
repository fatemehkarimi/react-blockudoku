import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameView from './game/gameView';
import './styles/general.scss';

function App() {
  return (
    <DndProvider backend={ HTML5Backend }>
      <GameView />
    </DndProvider>
  );
    
}

export default App;