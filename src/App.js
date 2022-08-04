import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Game from './game/game';
import './styles/general.scss';

function App() {
  return (
    <DndProvider backend={ HTML5Backend }>
      <Game />
    </DndProvider>
  );
    
}

export default App;