import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameController from './game/gameController';
import './styles/general.scss';

function App() {
  return (
    <DndProvider backend={ HTML5Backend }>
      <GameController />
    </DndProvider>
  );
    
}

export default App;