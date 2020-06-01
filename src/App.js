import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

import {config} from './config.js';

import './App.css';
import Lobby from './components/Lobby/Lobby';
import Board from './components/Board/Board';
import Waiting from './components/Waiting/Waiting';
import Results from './components/Results/Results';


const App = () => {


const [ stage, setStage ] = useState(1);
const [ move, setMove ] = useState(null);
const [ response, setResponse ] = useState(null);
const [ accounts, setAccounts ] = useState({
  name: config.ACCOUNT.NAME,
  secret: config.ACCOUNT.SECRET,
  id: config.ACCOUNT.ID,
  opponent: config.ACCOUNT.OPPONENT
})

console.log("CONFIG:", process.env)
const enterGame = () => {
  setStage(config.stages.START) // 2
}

const restartGame = () => {
  setStage(config.stages.LOBBY) // 1
  setMove(null)
}

return (
  <div className="App">
    <div className="container">
    {
      stage === 1 && 
      <Lobby 
        enterGame={enterGame}
        accounts={accounts}
        
      />
    }
    {
      stage === 2 && 
      <Board 
        setStage={setStage} 
        setMove={setMove}
        accounts={accounts}  
      />
    }
    {
      stage === 3 &&
      <Waiting 
        move={move}
        setStage={setStage} 
        setResponse={setResponse}
        accounts={accounts}  
      />
    }
    {
      stage === 4 &&
      <Results 
        move={move}
        restartGame={restartGame}
      />
    }
    </div>
  </div>
);
}

export default App;
