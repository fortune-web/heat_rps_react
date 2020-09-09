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
import Payment from './components/Payment/Payment';


const App = () => {

  const [ stage, setStage ] = useState(stages.LOBBY);
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

  const enterGame = async (game) => {

    if (!account.password) {
      setGame({
        id: game.id,
        amount: game.amount,
        opponent_name: game.status === 'CREATED' ? 'WAITING' : game.account_name1 || game.account_id1,
        opponent_id: game.status === 'CREATED' ? '-' : game.account_id1,
        rounds: game.rounds,
        status: 'CREATED'
      })
      setStage(stages.CREATED)
      return
    }

      const params = {
        game_id: game.id,
        password: account.password,
      }

      console.log("LOAD:", params)

      const resp = await fetch(API_URL + 'start', {
        method: 'POST',
        body: JSON.stringify(params),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await resp.json()

      console.log("STARTED:", data)

      if (data.error) {
        alert(data.error)
        return
      }


    setPlayer(data.player)

    setGame({
      id: data.id,
      pin: data.pin,
      account_id: data.account_id,
      account_name: data.account_name,
      opponent_id: data.opponent_id,
      opponent_name: data.opponent_name,
      rounds: data.rounds,
      amount: data.amount,
      status: data.status,
      current_round: 1
    })
    setAccount(oldAccount=>({
      ...oldAccount,
      id: data.account_id,
      name: data.account_name,
    }))
    setStage(
      (data.status === 'CREATED') ? stages.CREATED : 
      (data.status === 'FINISHED') ? stages.FINISHED : 
      (data.status === 'STARTED') ? stages.STARTED :
      (data.status === 'FUNDED') ? stages.FUNDED : 
      stages.STARTED)
    
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

      if (resp.ok) {
        setGame({
          id: bet.id,
          pin: data.game_pin,
          amount: data.amount,
          rounds: data.rounds,
          status: 'LOGIN'
        })
        setStage(stages.LOGIN) 
      }

  }


  const restartGame = () => {
    setResponse(null)
    setMoves([])
    setStage(stages.LOBBY) // 1
  }

  useEffect(() => { async function getAccount() {
      if (account.secret) {
        const gameData = await HGame.getAccountBySecret(account.secret)
        console.log("ACC:", gameData)
        setAccount(newAcc=>({
          secret: newAcc.secret,
          id: gameData.id,
          name: gameData.publicName
        }))
      }
    }
    getAccount()
  }, [account.secret])


  // console.log("GAME:", game)
  return (
    <div className="App">
      <div className="container">
      {
/*        stage === stages.LOGIN && // 0
        <Login
          account={account}
          setAccount={setAccount}
          setStage={setStage}
          changeAccount={changeAccount}
        />
*/      }
      {
        stage === stages.LOBBY && // 1
        <Lobby 
          enterGame={enterGame}
          loadGame={loadGame}
          bets={bets}
          setBets={setBets}
          stage={stage}
          setStage={setStage}
          game={game}
          setGame={setGame}
        />
      }
      {
        (stage === stages.CREATED || stage == stages.FUNDED || stage === stages.LOGIN ) && // 1
        <Payment 
          enterGame={enterGame}
          account={account}
          setAccount={setAccount}
          setStage={setStage}
          bets={bets}
          setBets={setBets}
          stage={stage}
          setGame={setGame}
          game={game}
          enterGame={enterGame}
          setPlayer={setPlayer}
        />
      }  
      {
        stage === stages.NOTHING && // 1
        <Waiting 
          enterGame={enterGame}
          account={account}
          setAccount={setAccount}
          setStage={setStage}
          bets={bets}
          setBets={setBets}
          stage={stage}
          setGame={setGame}
          game={game}
          enterGame={enterGame}
        />
      }     
      {
        (stage === stages.STARTED || stage === stages.FINISHED) && // 2
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
          setAccount={setAccount}
          player={player}
        />
      }

      </div>
    </div>
  );
}

export default App;
