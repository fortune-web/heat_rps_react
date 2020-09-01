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
  player
}) => {

  const [ waiting, setWaiting ] = useState(false) // To wait for the own move to be sent
  const [ password, setPassword ] = useState('')
  const [ opponentName, setOpponentName ] = useState('WAITING')


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

    if ( !data ) {
      alert("LISTENING CONNECTION ERROR")
      return
    }

    setGame({
      password: data.password,
      account_id: data.account_id,
      status: 'FUNDED'
    })

    setAccount({
      id: data.account_id,
      name: data.account_name
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

      <h2>To start the game, send {game.amount} HEAT to the account</h2>

      <div className="mainAccount">{mainAccount}</div>

      <button onClick={()=>paid()}>PAYMENT MADE</button> 
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
