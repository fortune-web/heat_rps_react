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

import './Board.css';
import { stages } from '../../config.js';

import crypto from 'crypto';


const Board = ({ stage, setStage, game, setGame, move, setMove, account, player }) => {

  const [ password, setPassword ] = useState('')
  var refSubscriber = useRef(null)

  const play = async (element) => {

    if ( element === '?' ) return

    if ( player === 1 ) {
      let message = HGame.aesEncrypt(element, password)
      message = JSON.stringify({
        move: message
      })
      const vars = {
        card: message,
        account: account,
        opponent: account.opponent,
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


        const params = {
          game_id: game.id,
          account_id: account.id,
          move: message,
          password: password,
          round: game.current_round,
          player
        }


        httpClient.apiPost('move', {
          params, 
        }).then(({ data }) => {
          if(data && data.length) {
            
          } else {
            alert("CONNECTION ERROR")
          }
        })

        setStage(stages.WAITING_FOR_SECOND) // 4


      } else {
        // Failure
        alert("There was an error trying to broadcast the move")
        return
      }

    }

    if ( player === 2 ) {

      const vars = {
        card: JSON.stringify({move: element}),
        account: account,
        opponent: player === 1 ? game.opponent : game.account_id,
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

      } else {
        // Failure
        alert("There was an error trying to broadcast the move")
        return
      }
    }

  }

  const waitForPlayer1 = async (m) => {
console.log("M:", m)
    if (m && m.sender === account.opponent) {

      let message = await HGame.readMessage(m, account.secret)
      console.log("RECEIVED:", message)
      message = JSON.parse(message)
      if (!message.password) {
        setMove({
          ...move,
          player1Move: message.move
        })
      }
      if (refSubscriber) {
        refSubscriber.close()
        refSubscriber = null
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
    setPassword(generatePassword(14))

    refSubscriber = HGame.subscribe('messages', waitForPlayer1)

  }, [game.round])


  return (
    <div className="Board">

      <div className="gameInfo">
        <div className="listItem">
          <span className="listName">Game Id</span>
          <span className="listData">{game.id}</span>
        </div>
        <div className="listItem">
          <span className="listName">Opponent Id</span>
          <span className="listData">{player === 1 ? game.opponent : game.account_id}</span>
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

      { (game.current_round <= game.rounds) &&

      <div className="playerBoard">

        <h2>Round
        <span className="roundNumber">{game.current_round}</span></h2>
        <h1>Make your move</h1>

        <div className="selectInfo">
          <Element element='rock' play={play} />
          <Element element='paper' play={play} />
          <Element element='scissor' play={play} />
          <p>Select rock, paper or scissor</p>
        </div>


        { 1==2 &&
        <div className="passwordInfo">
          <p>Password to encrypt your move (you can change it)</p>
          <input className="passwordInput" type="text" value={ password } onChange={ (e) => updatePassword(e) }/>
        </div>
        }

      </div>
      }


    </div>
  );
}

export default Board;
