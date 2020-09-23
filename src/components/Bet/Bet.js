import React, {}from 'react';
import PropTypes from 'prop-types';

import './Bet.css';

const Bet = ({ bet, enterGame, loadGame }) => {

  const startGame = () => {
    enterGame(bet)
  }

  // if ( !bet.account_id ) return null
    
  return (
    <div className="Bet">
      <div className="rounds"># {bet.id}</div>
      <div className="category">ACCOUNT<span>{bet.account_name1 || bet.account_id1 || '-'}</span></div>
      <div className="category">AMOUNT<span>{bet.amount / 100000000} HEAT</span></div>
      <div className="category">ROUNDS<span>{bet.rounds}</span></div>
      <div>
      {
        (bet.status === 'FINISHED') &&
          <input className="inputButton" type="button" onClick={() => loadGame(bet)} value="FINISHED" />
      }
      {
          (bet.status === 'FUNDED' || bet.status === 'CREATED') &&
            <input className="inputButton" type="button" onClick={() => startGame()} value="START GAME" />
      }
      {
          (bet.status === 'STARTED') &&
            <input className="inputButton" type="button" onClick={() => loadGame(bet)} value="CONTINUE GAME" />
        }
        
      </div>
    </div>
  );
}

Bet.propTypes = {
  bet: PropTypes.object.isRequired,
  enterGame: PropTypes.func.isRequired,
  loadGame: PropTypes.func.isRequired,
};

export default Bet;
