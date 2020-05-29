import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

// Components
import Element from '../Element/Element';

import './Results.css';


const Results = ({ move, restartGame }) => {

  return (
    <div className="Results">
      <p>YOU HAVE CHOOSEN</p>
      <Element element={move.card} />
      <p>Awaiting for the other player</p>
      <input type="button" value="Play again" onClick={()=>restartGame()} />
    </div>
  );
}

export default Results;
