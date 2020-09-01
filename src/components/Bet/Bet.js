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

  if ( !bet.account_id ) return null
    
  return (
    <div className="Bet">
      <div className="account">ACCOUNT: {bet.account_name1 || bet.account_id1}</div>
      <div className="amount">AMOUNT: {bet.amount}</div>
      <div className="rounds">ROUNDS: {bet.rounds}</div>
      <div>
      {
        (bet.status === 'FINISHED') &&
          <input className="inputButton" type="button" onClick={() => loadGame(bet)} value="FINISHED" />
        ||
          (bet.status === 'CREATED' && bet.account_id1 != account.id) &&
            <input className="inputButton" type="button" onClick={() => startGame(bet)} value="START GAME" />
          ||
          (bet.status === 'STARTED' || (bet.status === 'CREATED' && bet.account_id1 === account.id)) &&
            <input className="inputButton" type="button" onClick={() => loadGame(bet)} value="CONTINUE GAME" />
        }
        
      </div>
    </div>
  );
}

export default Bet;
