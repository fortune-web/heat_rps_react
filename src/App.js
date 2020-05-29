import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';
import logo from './logo.svg';
import './App.css';
import Lobby from './components/Lobby/Lobby';
import Board from './components/Board/Board';
import Results from './components/Results/Results';

const App = () => {

const [ etapa, setEtapa ] = useState(1);


const enterGame = () => {
  setEtapa(2)
}

return (
  <div className="App">
    <div className="container">
    {
      etapa === 1 && 
      <Lobby enterGame={enterGame}/>
    }
    {
      etapa === 2 && 
      <Board />
    }
    {
      etapa === 3 &&
      <Results />
    }
    </div>
  </div>
);
}

export default App;
