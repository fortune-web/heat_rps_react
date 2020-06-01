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


const Waiting = ({ move, setStage, setResponse, accounts }) => {


  const getMessage = async (m) => {

    console.log("MESSAGE:", m)

    if (m && m.recipient === accounts.id) {

      let message

      if ( m.messageIsEncrypted ) {
        message = await HGame.decryptMessage(m, accounts)
      } else {
        message = HGame.hex2a(m.messageBytes)
      }

      console.log("MOVE:", message)

      if ( message === "rock" || message === "paper" || message === "scissor") {
        setResponse(message)
        setStage(config.stages.RESULTS)
      }
    }
  } 

  useEffect(() => {
    HGame.subscribe('messages', getMessage)
  }, [])

  return (
    <div className="Waiting">
      <p>YOU HAVE CHOOSEN</p>
      <Element element={move.card} />
      <p>Your encrypted move:</p>
      <p>{move.message}</p>
      <p>Your password:</p>
      <p>{move.signature}</p>
      <p>Awaiting for the other player</p>

    </div>
  );
}

export default Waiting;
