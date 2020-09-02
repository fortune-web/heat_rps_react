import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

// heat Game Library
import HGame from '@ethernity/heat-games';

import httpClient from '../../helpers/axios';

// Components
import Element from '../Element/Element';
import Encrypter from '../Encrypter/Encrypter';

import './Payment.css';
import { stages, API_URL, mainAccount } from '../../config.js';

import crypto from 'crypto';


const Payment = ({ 
  stage, setStage, 
  game, setGame, 
  account, setAccount,
  round, setRound,
  opponentMoves, setOpponentMoves,  
  player, setPlayer,
  enterGame
}) => {

  const [ waiting, setWaiting ] = useState(false) // To wait for the own move to be sent
  const [ password, setPassword ] = useState('')
  const [ opponentName, setOpponentName ] = useState('WAITING')

  var opponentTimeout

  const paid = async () => {

    const params = {
        game_id: game.id,
    }

    const resp = await fetch(API_URL + 'paid', {
      method: 'POST',
      body: JSON.stringify(params), 
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await resp.json()

    console.log("PAID:", data)

    if ( !data ) {
      alert("LISTENING CONNECTION ERROR")
      return
    }

    if ( data.status === "OK") {
      setGame((prev)=>({
        ...prev,
        password: data.password,
        account_id: data.account_id,
        status: 'FUNDED'
      }))
      setAccount({
        id: data.account_id,
        name: data.account_name,
        password: data.password
      })

      setStage(stages.FUNDED)
      setPlayer(1)
    }

  }


  const checkStatus = async () => {

    const params = {
      game_id: game.id
    }
    console.log("PREVLOAD:", params)
    const resp = await fetch(API_URL + 'load', {
      method: 'POST',
      body: JSON.stringify(params),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log("LOAD:", resp)
    const data = await resp.json()

    console.log("LOADJSON:", data)

    if (data.status === 'FUNDED') {
      opponentTimeout = setTimeout(checkStatus,5000)
      return
    }

    if (data.status = 'STARTED') {
      setGame({
        opponent_id: data.account_id2,
        opponent_name: data.account_name2,
        status: 'STARTED'
      })
      setStage(stages.STARTED)
    }
  }


  useEffect(() => {
    if (game.status === 'FUNDED') {
      checkStatus()
    }
    return () => {
      clearTimeout(opponentTimeout)
    }
  }, [game.status])




  const updatePassword = () => {
    setAccount(
      {
        password: document.getElementById('password').value,
      })
  }
    console.log("game:", game)
  // console.log("MOVES:", moves)

  return (
    <div className="Payment">

      <div className="gameInfo">
        <div className="listItem">
          <span className="listName">Game Id</span>
          <span className="listData">{game.id}</span>
          <span className="listDataPin">{game.pin}</span>
        </div>
        <div className="listItem">
          <span className="listName">Opponent</span>
          <span className="listData">{opponentName}</span>
        </div>
        <div className="listItem">
          <span className="listName">Bet amount</span>
          <span className="listData">{game.amount} HST</span>
        </div>
        <div className="listItem">
          <span className="listName">Number of rounds</span>
          <span className="listData">{game.rounds}</span>
        </div>
      </div>
{
  game.status === 'FUNDED' &&
  <h2>Game is funded. Waiting for an opponent to bet</h2>
}
{
  game.status === 'CREATED' && 
  <h2>Game is waiting for funds. Make your bet to start the game</h2>
}
      <h2>To make your bet, send {game.amount} HEAT to the account:</h2>

      <div className="mainAccount">{mainAccount}</div>

      <button onClick={()=>paid()}>PAYMENT MADE</button> 

      <h2>Or login if you already have a password</h2>
      <input placeholder="Password" id="password" type="text" className="inpPassword" onChange={()=>updatePassword()} value={account.password} /> 
      <button onClick={()=>enterGame(game.id)}>ENTER</button>
      {
        stage === stages.FINISHED &&
        <div className='finalBoard'>
          <h2>GAME FINISHED</h2>
          <h2>{ (game.winner === 0) ? 'IT IS A DRAW!' : (game.winner === player) ? 'YOU WON THE GAME!' : 'YOU LOSE THE GAME!' }</h2>
        </div>
      }
      
    </div>
  );
}

export default Payment;
