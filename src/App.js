import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

import { config, stages } from './config.js';

import './App.css';
import Login from './components/Login/Login';
import Lobby from './components/Lobby/Lobby';
import Board from './components/Board/Board';
import Waiting from './components/Waiting/Waiting';
import Results from './components/Results/Results';


const App = () => {

  const [ stage, setStage ] = useState(stages.LOGIN);
  const [ move, setMove ] = useState(null);
  const [ player, setPlayer ] = useState(null);
  const [ game, setGame ] = useState({});
  const [ response, setResponse ] = useState(null);
  const [ account, setAccount ] = useState({
    name: config.ACCOUNT.NAME,
    secret: config.ACCOUNT.SECRET,
    id: config.ACCOUNT.ID,
  })
  const [ bets, setBets ] = useState({});

  // console.log("CONFIG:", process.env)

  const enterGame = (bet) => {
    setPlayer(2)
    setGame({
      id: bet.id,
      account_id: bet.account_id,
      opponent: account.id,
      rounds: bet.rounds,
      amount: bet.amount,
      current_round: 1
    })
    setStage(stages.GAME) // 2
  }

  const restartGame = () => {
    setResponse(null)
    setMove(null)
    setStage(stages.LOBBY) // 1
  }

    console.log("GAME:", game)
  return (
    <div className="App">
      <div className="container">
      {

        stage === stages.LOGIN && // 0
        <Login
          account={account}
          setAccount={setAccount}
          setStage={setStage}
        />
      }
      {
        stage === stages.LOBBY && // 1
        <Lobby 
          enterGame={enterGame}
          account={account}
          setAccount={setAccount}
          bets={bets}
          setBets={setBets}
        />
      }
      {
        stage === stages.GAME && // 2
        <Board 
          stage={stage}
          setStage={setStage} 
          game={game}
          setGame={setGame}
          setMove={setMove}
          account={account}  
          player={player}
        />
      }
      {
        stage >= stages.WAITING_FOR_FIRST && // 3
        <Waiting 
          move={move}
          stage={stage}
          setStage={setStage} 
          response={response}
          setResponse={setResponse}
          restartGame={restartGame}
          account={account}  
          player={player}
        />
      }

      </div>
    </div>
  );
}

export default App;
