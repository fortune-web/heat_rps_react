import React, {
  useState,
} from 'react';

// heat Game Library
import HGame from '@ethernity/heat-games';

import { stages, API_URL } from './config.js';

import './App.css';
import Lobby from './components/Lobby/Lobby';
import Board from './components/Board/Board';
import Payment from './components/Payment/Payment';

HGame.Config({isTestnet: true})

const App = () => {

  const [ stage, setStage ] = useState(stages.LOBBY);
  const [ moves, setMoves ] = useState([]);
  const [ opponentMoves, setOpponentMoves ] = useState([]);
  const [ player, setPlayer ] = useState(null);
  const [ game, setGame ] = useState({});
  const [ account, setAccount ] = useState({})
  const [ bets, setBets ] = useState([]);


  const enterGame = async (game) => {

    if (!account.password) {
      setGame({
        id: game.id,
        amount: game.amount,
        message: game.message,
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

    const resp = await fetch(API_URL + 'start', {
      method: 'POST',
      body: JSON.stringify(params),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await resp.json()

    if (data.error) {
      alert(data.error)
      return
    }

    setPlayer(data.player)

    setGame({
      id: data.id,
      pin: data.pin,
      message: data.message,
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

    const resp = await fetch(API_URL + 'load', {
      method: 'POST',
      body: JSON.stringify(params),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await resp.json()

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

  return (
    <div className="App">
      <div className="container">

      {
        stage === stages.LOBBY &&
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
        (stage === stages.CREATED || stage === stages.FUNDED || stage === stages.LOGIN ) &&
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
          setPlayer={setPlayer}
        />
      }
      {
        (stage === stages.STARTED || stage === stages.FINISHED) &&
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
