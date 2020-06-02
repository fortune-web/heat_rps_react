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
const [ player, setPlayer ] = useState(null);
const [ response, setResponse ] = useState(null);
const [ accounts, setAccounts ] = useState({
  name: config.ACCOUNT.NAME,
  secret: config.ACCOUNT.SECRET,
  id: config.ACCOUNT.ID,
  opponent: config.ACCOUNT.OPPONENT
})

console.log("CONFIG:", process.env)

const enterGame = (player) => {
  setPlayer(player)
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
      stage === config.stages.LOBBY && // 1
      <Lobby 
        enterGame={enterGame}
        accounts={accounts}
        setAccounts={setAccounts}
      />
    }
    {
      stage === config.stages.START && // 2
      <Board 
        stage={stage}
        setStage={setStage} 
        move={move}
        setMove={setMove}
        accounts={accounts}  
        player={player}
      />
    }
    {
      stage >= config.stages.WAITING_FOR_FIRST && // 3
      <Waiting 
        move={move}
        stage={stage}
        setStage={setStage} 
        response={response}
        setResponse={setResponse}
        restartGame={restartGame}
        accounts={accounts}  
        player={player}
      />
    }

    </div>
  </div>
);
}

export default App;
