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
  const [ moves, setMoves ] = useState([]);
  const [ opponentMoves, setOpponentMoves ] = useState([]);
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


  const changeAccount = (acc) => {

    if ( acc === 1 ) {
      setAccount({
        name: config.ACCOUNT.NAME,
        secret: config.ACCOUNT.SECRET,
        id: config.ACCOUNT.ID,
      })
    } else {
      setAccount({
        name: config.ACCOUNT2.NAME,
        secret: config.ACCOUNT2.SECRET,
        id: config.ACCOUNT2.ID,
      }) 
    }
  }

  const enterGame = async (bet) => {
    if ( bet.state === 'CREATED' ) {

      const params = {
        game_id: bet.id,
        opponent_id: account.id,
      }

      const resp = await fetch('http://localhost:3010/start', {
        method: 'POST',
        body: JSON.stringify(params),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log("STARTED:", resp)
    }


    setPlayer(2)
    setGame({
      id: bet.id,
      account_id: bet.account_id,
      opponent: account.id,
      rounds: bet.rounds,
      amount: bet.amount,
      current_round: 1
    })
    setStage(stages.STARTED) // 2
    
  }

  const loadGame = async (bet) => {

      const params = {
        game_id: bet.id,
      }
      console.log("LOADGAME:", params)
      const resp = await fetch('http://localhost:3010/load', {
        method: 'POST',
        body: JSON.stringify(params),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await resp.json()
      console.log("LOADED:", data)
      console.log("RESP:", resp)

      if (resp.ok) {

        if (data.account_id !== account.id) {
          console.log("EQ ACCOUNTS:")
          enterGame(bet)
          return
        }

        console.log("DIFF ACCOUNTS:")
        setPlayer(1)
        const newData = {
          id: data.id,
          account_id: data.account_id,
          opponent: data.opponent,
          rounds: data.rounds,
          amount: data.amount,
          current_round: 1
        }

        console.log("GAME:", newData)
        setGame({
          id: data.id,
          account_id: data.account_id,
          opponent: data.opponent,
          rounds: data.rounds,
          amount: data.amount,
          current_round: 1
        })
        setStage((data.state === 'CREATED') ? stages.STARTED : stages.STARTED) // 2
      }

  }


  const restartGame = () => {
    setResponse(null)
    setMoves([])
    setStage(stages.LOBBY) // 1
  }

  // console.log("GAME:", game)
  return (
    <div className="App">
      <div className="container">
      {

        stage === stages.LOGIN && // 0
        <Login
          account={account}
          setAccount={setAccount}
          setStage={setStage}
          changeAccount={changeAccount}
        />
      }
      {
        stage === stages.LOBBY && // 1
        <Lobby 
          enterGame={enterGame}
          loadGame={loadGame}
          account={account}
          setAccount={setAccount}
          bets={bets}
          setBets={setBets}
        />
      }
      {
        (stage === stages.STARTED || stage === stages.CREATED) && // 2
        <Board 
          stage={stage}
          setStage={setStage} 
          game={game}
          setGame={setGame}
          moves={moves}
          setMoves={setMoves}
          opponentMoves={opponentMoves} 
          setOpponentMoves={setOpponentMoves}
          account={account}  
          player={player}
        />
      }
      {
        stage > stages.WAITING_FOR_FIRST && // 3
        <Waiting 
          moves={moves}
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
