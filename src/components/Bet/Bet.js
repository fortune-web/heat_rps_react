import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

import './Bet.css';
import { config } from '../../config.js';

const Bet = ({ account, bet, enterGame }) => {

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
        bet.account_id !== account.id &&
        <input className="inputButton" type="button" onClick={() => startGame(bet)} value="START GAME" />
        ||
        <p>YOUR BET</p>
      }
        
      </div>
    </div>
  );
}

export default Bet;
