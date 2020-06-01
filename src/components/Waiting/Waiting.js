import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

// Components
import Element from '../Element/Element';

// heat Game Library
import HGame from '@ethernity/heat-games';

import './Waiting.css';

import { config } from '../../config.js';
import crypto from 'crypto';


const Waiting = ({ move, stage, setStage, response, setResponse, accounts }) => {

  const [ winner, setWinner ] = useState(null)

  /*
  * function getMessage
  * Receives message from blockchain for the opponent move
 */
  const getMessage = async (m) => {

    console.log("MESSAGE:", m)

    if (m && m.recipient === accounts.id) {

      let message

      if ( m.messageIsEncrypted ) {
        let data = await HGame.decryptMessage(m, accounts)
        message = data.message
      } else {
        message = HGame.hex2a(m.messageBytes)
      }
      console.log("CARD:", move.card)
      console.log("MOVE:", message)

      if ( message === "rock" || message === "paper" || message === "scissor") {
        setResponse({
          card: message
        })

        if (move.card === message) {
          setWinner("DRAW!")
        }
        if ( 
          (move.card === "rock" && message === "scissor") ||
          (move.card === "paper" && message === "rock") ||
          (move.card === "scissor" && message === "paper")
        ) {
          setWinner("YOU WIN!")
        }
        if ( 
          (move.card === "rock" && message === "paper") ||
          (move.card === "paper" && message === "scissor") ||
          (move.card === "scissor" && message === "rock")
        ) {
          setWinner("YOU LOSE!")
        }
        setStage(config.stages.RESULTS)

        const vars = {
          card: move.signature,
          account: accounts,
          opponent: accounts.opponent,
        }

        console.log("VARS:", vars)

        const data = await HGame.makeMove(vars);

        console.log("SENT:", data)

        if ( data && data.bradcasted ) {
          setStage(config.stages.FINISHED)
        }

      }
 
    }
  } 

  useEffect(() => {
    HGame.subscribe('messages', getMessage)
  }, [])





  return (
    <div className="Waiting">
      <div>
        <div className="cell">
          <p>YOUR MOVE</p>
          <Element element={move.card} />
          <p>Your encrypted move:</p>
          <p>{move.message}</p>
          <p>Your password:</p>
          <p>{move.signature}</p>
        </div>
        <div className="cell">
        {
          stage >= config.stages.RESULTS && 
          <div>
            <p>OPPONENT MOVED</p>
            <Element element={response.card} />
          </div>
        }
        </div>
      </div>
      <div>
        { stage < config.stages.RESULTS &&
          <p>Awaiting for the other player</p>
        }
        { stage >= config.stages.RESULTS &&
          <p><strong>{winner}</strong></p>
        }
      </div>

      {
        stage === config.stages.FINISHED && 
        <div>
        PASSWORD SENT TO OPPONENT
        </div>

      }
    </div>
  );
}

export default Waiting;
