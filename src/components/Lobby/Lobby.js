import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

import './Lobby.css';


const Lobby = ({ enterGame, accounts }) => {


  return (
    <div className="Lobby">
      <h1>LOBBY</h1>
      <p>Player 1</p>
  <p>
  <input placeholder="Account Name (email)" id="name" type="text" className="inpName" value={accounts.name || ''} />
  </p>
  <input placeholder="Secret phrase" id="secret" type="text" className="inpSecret" value={accounts.secret || ''} />
  <p>Opponent id</p>
  <input placeholder="id" id="opponentId" type="text" class="inpname" value={accounts.opponent || ''} />

      <p><input type="button" onClick={enterGame} value="Enter game" /></p>
    </div>
  );
}

export default Lobby;
