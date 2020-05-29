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


const Board = ({ element }) => {

  const [ signature, setSignature ] = useState('')


  const play = (element) => {
    HGame.makeMove({
      card: element,
      signature: signature
    });
  };

  const updateSignature = (e) => {
    setSignature(e.target.value)
  }

  const generatePassword = (length) => {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
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
