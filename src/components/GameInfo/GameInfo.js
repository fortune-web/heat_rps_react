import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

import './GameInfo.css';


const GameInfo = ({game}) => {

	return(
	  <div className="gameInfo">
	    <div className="listItem">
	      <span className="listName">Game Id</span>
	      <span className="listData">{game.id}</span>
	      <span className="listDataPin">{game.pin}</span>
	    </div>
	    <div className="listItem">
	      <span className="listName">Opponent</span>
	      <span className="listData">{game.opponent_name || '-'}</span>
	      <span className="listDataPin">{game.opponent_id || '-'}</span>
	    </div>
	    <div className="listItem">
	      <span className="listName">Bet amount</span>
	      <span className="listData">{game.amount / 100000000} HEAT</span>
	    </div>
	    <div className="listItem">
	      <span className="listName">Number of rounds</span>
	      <span className="listData">{game.rounds}</span>
	    </div>
	  </div>
	)

}


export default GameInfo;