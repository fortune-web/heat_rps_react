import React, {
  useState, 
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

// Components
import GameInfo from '../GameInfo/GameInfo';

import './Payment.css';
import { stages, API_URL, mainAccount } from '../../config.js';


const Payment = ({ 
  stage, setStage, 
  game, setGame, 
  account, setAccount,  
  player, setPlayer,
  enterGame
}) => {

  const [ isPaying, setPaying ] = useState(false)

  var opponentTimeout

  const paid = async () => {

    const params = {
        game_id: game.id,
    }

    setPaying(true)

    const resp = await fetch(API_URL + 'paid', {
      method: 'POST',
      body: JSON.stringify(params), 
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setPaying(false)
    
    const data = await resp.json()

    console.log("PAID:", data)

    if ( !data ) {
      alert("LISTENING CONNECTION ERROR")
      return
    }

    if ( data.status !== 'OK' ) {
      alert("ERROR: " + data.error)
      return
    }


    if ( data.status === "OK") {
      setGame(prevGame=>({
        ...prevGame,
        pin: data.pin,
        player: data.player,
        opponent_id: data.opponent_id,
        opponent_name: data.opponent_name,
        status: data.player === 1 ? 'FUNDED' : 'STARTED'
      }))
      setAccount({
        id: data.account_id,
        name: data.account_name,
        password: data.password
      })

      setPlayer(data.player)
      setStage(data.player === 1 ? stages.FUNDED : stages.STARTED)
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

    if (data.status === 'STARTED') {
      setGame(prevGame=>({
        ...prevGame,
        opponent_id: data.account_id2,
        opponent_name: data.account_name2,
        status: 'STARTED'
      }))
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


  const resetGame = () => {
    setGame(null)
    setAccount({})
    setStage(stages.LOBBY)
  }


  const updatePassword = () => {
    setAccount((account)=>(
      {
        ...account,
        password: document.getElementById('password').value,
      }))
    console.log("updatepass:", game)
  // console.log("MOVES:", moves)
}

  return (
    <div className="Payment">

    <GameInfo game={game}/>
    <button onClick={()=>resetGame()}>BACK TO LOBBY</button> 

{
  game.status === 'FUNDED' && // After the payment is made
  <div>
    <h2 className="gameAdvice">Game is funded. Waiting for an opponent to bet.</h2>
    <h2 className="gameAdvice">Game will begin when an opponent joins</h2>
    <h2>Save your password to reenter the game anytime:</h2>
    <h3>{account.password}</h3>

  </div>
}
{
  game.status === 'CREATED' && // When entering a FUNDED game for first time
  <h2 className="gameAdvice">Game is waiting for funds. Make your bet to start the game</h2>
}
{
  (game.status === 'CREATED' || (game.status === 'FUNDED' && !account.id)) &&
  <div>
      <h2>To make your bet, send {game.amount / 100000000} HEAT to the account:</h2>
      <div className="mainAccount">{mainAccount}</div>
      <h2>With the message:</h2>
      <div className="mainAccount">{game.id}</div>
      <h2>After that, press the button:</h2>
      {
      !isPaying &&
      <button onClick={()=>paid()}>PAYMENT MADE</button> 
      }
      {
      isPaying &&
      <p>CHECKING PAYMENT</p> 
      }
  </div>
}
{
  (game.status !== 'FUNDED') && 
  <div>
      <h2 className="loginAdvice">If you already have a password, login:</h2>
      <input placeholder="Password" id="password" type="text" className="inpPassword" onChange={()=>updatePassword()} value={account.password} /> 
      <button onClick={()=>enterGame(game)}>ENTER</button>
  </div>
}
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

Payment.propTypes = {
  stage: PropTypes.object,
  setStage: PropTypes.func,
  game: PropTypes.object,
  setGame: PropTypes.func,
  account: PropTypes.object,
  setAccount: PropTypes.func,
  player: PropTypes.object,
  setPlayer: PropTypes.func,
  enterGame: PropTypes.func,
};

export default Payment;
