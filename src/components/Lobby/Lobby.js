import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

import './Lobby.css';


const Lobby = ({ enterGame }) => {


  return (
    <div className="Lobby">
      <p>LOBBY</p>
      <input type="button" onClick={enterGame} value="Enter game" />
    </div>
  );
}

export default Lobby;
