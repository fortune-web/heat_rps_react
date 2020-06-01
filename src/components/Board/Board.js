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


const Board = ({ setStage, setMove, accounts }) => {

  const [ signature, setSignature ] = useState('')


  const play = async (element) => {

   const message = HGame.aesEncrypt(element, signature)

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
      // Success
      setMove({
        card: element,
        signature,
        message
      })

      setStage(config.stages.WAITING_FOR_SECOND) // 3

    } else {
      alert("There was an error trying to brodcast the move")
      return
    }
  };


  const updateSignature = (e) => {
    setSignature(e.target.value)
  }

  const generatePassword = (length) => {
    return crypto.randomBytes(length).toString('base64')
}



  useEffect(() => {
    setSignature(generatePassword(14))
  }, [])


  return (
    <div className="Board">
    <p>Password to encrypt your move (you can change it)</p>
    <input type="text" value={ signature } onChange={ updateSignature }/>
    <p>Select rock, paper or scissor</p>
      <Element element='rock' play={play} />
      <Element element='paper' play={play} />
      <Element element='scissor' play={play} />
    </div>
  );
}

export default Board;
