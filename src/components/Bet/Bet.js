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
      <div className="account">ACCOUNT: {bet.account_id}</div>
      <div className="amount">AMOUNT: {bet.amount}</div>
      <div className="rounds">ROUNDS: {bet.rounds}</div>
      <div>
      {
        (bet.state === 'CREATED' && bet.account_id != account.id) &&
        <input className="inputButton" type="button" onClick={() => startGame(bet)} value="START GAME" />
        ||
        <input className="inputButton" type="button" onClick={() => loadGame(bet)} value="CONTINUE GAME" />
      }
        
      </div>
    </div>
  );
}

export default Bet;
