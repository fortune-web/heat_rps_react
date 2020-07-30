import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

// heat Game Library
import HGame from '@ethernity/heat-games';

import { config, stages, API_URL } from './config.js';

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
        secret: config.ACCOUNT.SECRET,
      })
    } else {
      setAccount({
        secret: config.ACCOUNT2.SECRET,
      }) 
    }
  }

  const enterGame = async (data) => {
    if ( data.state === 'CREATED' ) {

      const params = {
        game_id: data.id,
        opponent_id: account.id,
      }

      const resp = await fetch(API_URL + 'start', {
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
      id: data.id,
      account_id: data.account_id,
      opponent: account.id,
      rounds: data.rounds,
      amount: data.amount,
      state: data.state,
      current_round: 1
    })
    setStage((data.state === 'CREATED') ? stages.CREATED : (data.state === 'FINISHED') ? stages.FINISHED : stages.STARTED)
    
  }

  const loadGame = async (bet) => {

      const params = {
        game_id: bet.id,
      }
      console.log("LOADGAME:", params)
      const resp = await fetch(API_URL + 'load', {
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
          enterGame(data)
          return
        }

        console.log("DIFF ACCOUNTS:")
        setPlayer(1)
        setGame({
          id: data.id,
          account_id: data.account_id,
          opponent: data.opponent,
          rounds: data.rounds,
          amount: data.amount,
          state: data.state,
          current_round: 1
        })
        setStage((data.state === 'CREATED') ? stages.CREATED : (data.state === 'FINISHED') ? stages.FINISHED : stages.STARTED) 
      }

  }


  const restartGame = () => {
    setResponse(null)
    setMoves([])
    setStage(stages.LOBBY) // 1
  }


  useEffect(() => { async function getAccount() {
      const gameData = await HGame.getAccountBySecret(account.secret)
      console.log("ACC:", gameData)
      setAccount(newAcc=>({
        secret: newAcc.secret,
        id: gameData.id,
        name: gameData.publicName
      }))
    }
    getAccount()
  }, [account.secret])


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
        (stage === stages.STARTED || stage === stages.CREATED || stage === stages.FINISHED) && // 2
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

      </div>
    </div>
  );
}

export default App;
