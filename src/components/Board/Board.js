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

  useEffect(() => {
    signature = Math.random(12348).toHex()
  }, [])


  return (
    <div className="Board">
    <input type="text" value={ signature } onChange={ updateSignature }/>
    <p>Select rock, paper or scissor</p>
      <Element element='rock' play={play} />
      <Element element='paper' play={play} />
      <Element element='scissor' play={play} />
    </div>
  );
}

export default Board;
