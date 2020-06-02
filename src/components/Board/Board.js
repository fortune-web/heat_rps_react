import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

// heat Game Library
import HGame from '@ethernity/heat-games';

// Components
import Element from '../Element/Element';

import './Board.css';
import { config } from '../../config.js';

import crypto from 'crypto';


const Board = ({ stage, setStage, move, setMove, accounts, player }) => {

  const [ password, setPassword ] = useState('')


  const play = async (element) => {

  if ( element === '?' ) return

  if ( player === 1 ) {
    let message = HGame.aesEncrypt(element, password)
    message = JSON.stringify({
      move: message
    })
    const vars = {
      card: message,
      account: accounts,
      opponent: accounts.opponent,
    }
    console.log("VARS:", vars)

    const data = await HGame.makeMove(vars);
    console.log("DATA:", data)

    if ( data && data.errorCode ) {
      alert(data.errorDescription)
      return
    }

    if ( data && data.broadcasted ) {
      // Success, move sent
      setMove({
        ...move,
        card: element,
        password,
        message
      })
      setStage(config.stages.WAITING_FOR_SECOND) // 4
    } else {
      // Failure
      alert("There was an error trying to broadcast the move")
      return
    }

  }

  if ( player === 2 ) {

    const vars = {
      card: JSON.stringify({move: element}),
      account: accounts,
      opponent: accounts.opponent,
    }
    console.log("VARS:", vars)

    const data = await HGame.makeMove(vars);
    console.log("DATA:", data)

    if ( data && data.errorCode ) {
      alert(data.errorDescription)
      return
    }

    if ( data && data.broadcasted ) {
      // Success, move sent
      setMove({
        ...move,
        card: element,
        password: null,
        message: element
      })
      setStage(config.stages.WAITING_FOR_FIRST) // 3
    } else {
      // Failure
      alert("There was an error trying to broadcast the move")
      return
    }
  }

  }

  const waitForPlayer1 = async (m) => {

    if (m && m.sender === accounts.opponent) {

      let message = await HGame.readMessage(m, accounts.secret)
      console.log("RECEIVED:", message)
      message = JSON.parse(message)
      if (!message.password) {
        setMove({
          ...move,
          player1Move: message.move
        })
      }

    }
  }


  const updatePassword = (e) => {
    setPassword(e.target.value)
  }

  const generatePassword = (length) => {
    return crypto.randomBytes(length).toString('base64').slice(0,-1)
}


  useEffect(() => {
    if (player === 1) setPassword(generatePassword(14))
    if (player === 2) HGame.subscribe('messages', waitForPlayer1)
  }, [])


  return (
    <div className="Board">
    { player === 1 &&
    <div>
    <p>Password to encrypt your move (you can change it)</p>
    <input type="text" value={ password } onChange={ (e) => updatePassword(e) }/>
    </div>
    }
    {
      player === 2 && stage === config.stages.START && !move &&
      <div>
      <p>WAITING FOR PLAYER 1 TO MOVE...</p>
      </div>
    }
    {
      player === 2 && move && move.player1Move && 
    <div>
    <p>PLAYER 1 MOVED!</p>
    <Element element='?' />
    <p>Encrypted move:</p>
    <p><strong>{move.player1Move}</strong></p>
    </div>
  }
  { (player === 1 || (player === 2 && move && move.player1Move)) &&
    <div>
    <p>Select rock, paper or scissor</p>
      <Element element='rock' play={play} />
      <Element element='paper' play={play} />
      <Element element='scissor' play={play} />
      </div>
    }
    </div>
  );
}

export default Board;
