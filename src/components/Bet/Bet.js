import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

import './Bet.css';
import { config } from '../../config.js';

const Bet = ({ account, bet, enterGame, loadGame }) => {

  const startGame = (bet) => {
    enterGame(bet)
  }

  // if ( !bet.account_id ) return null
    
  return (
    <div className="Bet">
      <div className="rounds"># {bet.id}</div>
      <div className="category">ACCOUNT<span>{bet.account_name1 || bet.account_id1 || '-'}</span></div>
      <div className="category">AMOUNT<span>{bet.amount / 100000000} HST</span></div>
      <div className="category">ROUNDS<span>{bet.rounds}</span></div>
      <div>
      {
        (bet.status === 'FINISHED') &&
          <input className="inputButton" type="button" onClick={() => loadGame(bet)} value="FINISHED" />
        ||
          (bet.status === 'FUNDED' || bet.status === 'CREATED') &&
            <input className="inputButton" type="button" onClick={() => startGame(bet)} value="START GAME" />
        ||
          (bet.status === 'STARTED') &&
            <input className="inputButton" type="button" onClick={() => loadGame(bet)} value="CONTINUE GAME" />
        }
        
      </div>
    </div>
  );
}

export default Bet;
