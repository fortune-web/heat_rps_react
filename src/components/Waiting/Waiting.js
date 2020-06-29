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


const Waiting = ({ moves, stage, setStage, response, setResponse, restartGame, account, player }) => {

  const [ winner, setWinner ] = useState(null)
  const [ decryptResult, setDecryptResult ] = useState(null)
  const [ value1, setValue1 ] = useState()
  const [ value2, setValue2 ] = useState()

  var refSubscriber = useRef(null)
  /*
  * function getMessage
  * Receives message from blockchain for the opponent move
 */
  const getMessage = async (m) => {

    console.log("THIS:", this)
    console.log("MESSAGE:", m)
    console.log("MOVE:", moves)
    console.log("ACC:", account)
    if ((m && m.recipient === account.opponent) || 
      (m && m.sender === account.opponent)) {

      let message
      let data = await HGame.readMessage(m, account.secret)
      data = JSON.parse(data)

      console.log("CARD:", moves.player1Move)
      console.log("MESSAGE:", data)

      if ( player === 2 && data.password) {
        // Decrypt move previously received with the password recently received
        try {
          message = HGame.aesDecrypt(moves.player1Move, data.password)
          setResponse({
            card: message,
            password: data.password
          })
          setStage(config.stages.RESULTS)
        } catch(e) {
          console.log(e)
        }
      }

      if ( player === 1 ) {
        message = data.moves
      }

      if ( message === "rock" || message === "paper" || message === "scissor") {

        if (player === 1) {
          setResponse({
            card: message
          })
        }

        if (moves.card === message) {
          setWinner("DRAW!")
        }
        if ( 
          (moves.card === "rock" && message === "scissor") ||
          (moves.card === "paper" && message === "rock") ||
          (moves.card === "scissor" && message === "paper")
        ) {
          setWinner("YOU WIN!")
        }
        if ( 
          (moves.card === "rock" && message === "paper") ||
          (moves.card === "paper" && message === "scissor") ||
          (moves.card === "scissor" && message === "rock")
        ) {
          setWinner("YOU LOSE!")
        }
        

        if (player === 1) {
          const vars = {
            card: JSON.stringify({password: moves.password}),
            account: account,
            opponent: account.opponent,
          }
          console.log("VARS:", vars)
          const data = await HGame.makeMove(vars);
          console.log("SENT:", data)
        }

      setStage(config.stages.RESULTS)
      }
    //  }

    }

    if (refSubscriber) {
      refSubscriber.close()
      refSubscriber = null
    }
  } 

  useEffect(() => {
    refSubscriber = HGame.subscribe('messages', getMessage)
  }, [])


  useEffect(() => {
    if (moves && moves.player1Move) setValue1(moves.player1Move)
  }, [moves])

  useEffect(() => {
    if (response && response.password) setValue2(response.password)
  }, [response])


  const tryDecrypt = () => {
    let message = document.getElementById('value1').value
    let password = document.getElementById('value2').value
    try {
      let decrypt = HGame.aesDecrypt(message, password)
      setDecryptResult(decrypt)
    } catch(e) {
      setDecryptResult("ERROR")
    }  
  }
  

  const update1 = (e) => {
    setValue1(e.target.value)
  }

  const update2 = (e) => {
    setValue2(e.target.value)
  }

  return (
    <div className="Waiting">
      <div>

      { player === 1 &&
        <div className="cell">
          <p>YOUR MOVE</p>
          <Element element={moves.card} />
          <p>Your encrypted move:</p>
          <p>{JSON.parse(moves.message).move}</p>
          <p>Your password:</p>
          <p>{moves.password}</p>
        </div>
      }

      {
        player === 2 &&
        <div className="cell">
          <p>OPPONENT MOVE</p>
          <Element element={(response && response.card) ? response.card : moves.player1Move} />
          <p>His/her encrypted move:</p>
          <p>{moves.player1Move}</p>
          {
            response && response.password && 
            <div>
            <p>His/her password:</p>
            <p>{response.password}</p>
            </div>
          }
        </div>
      }
        <div className="cell">
        {
          stage >= config.stages.RESULTS && player === 1 &&
          <div>
            <p>OPPONENT MOVE</p>
            <Element element={response.card} />
          </div>
        }
        {
          stage >= config.stages.RESULTS && player === 2 &&
          <div>
            <p>YOU MOVED</p>
            <Element element={moves.card} />
          </div>
        }
        </div>
      </div>
      <div>
        { player === 1 && stage < config.stages.RESULTS &&
          <p><strong>Awaiting for the other player</strong></p>
        }
        { stage >= config.stages.RESULTS &&
          <p><strong>{winner}</strong></p>
        }
      </div>

      {
        stage === config.stages.RESULTS && 
        <div>
        {
          player === 1 && 
        <p>PASSWORD SENT TO OPPONENT</p>
        }
        {
          player === 2 &&
          <div>
          <p>Criptographic comprobation</p>
          <input type="text" id="value1" value={value1} onChange={(e)=>update1(e)}/>
          <input type="text" id="value2" value={value2} onChange={(e)=>update2(e)}/>
          <input type="button" value="Decrypt" onClick={() => tryDecrypt()} />
          <p><strong>{decryptResult}</strong></p>
          </div>
        }
        <input type="button" value="Play again" onClick={() => restartGame()} />
        </div>

      }


    </div>
  );
}

export default Waiting;
