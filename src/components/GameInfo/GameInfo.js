import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import './GameInfo.css';

const GameInfo = ({ game, reset, name, password }) => {

    return(
      <div style={{ marginBottom:'20px' }}>
        <div className="gameInfo">
          <Row>
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
          </Row>
          <Row>
            <div className="list_welcome">
              { name &&
              <h6>Welcome : <sapn style={{color:'red'}}>{name}</sapn></h6>
              }
            </div>
            <div className="list_password">
              { password &&  <h6>Password to reenter : {password}</h6> }
            </div>
          </Row>
        </div>
        <Button onClick={() => reset()} className="list__reset" variant="danger">BACK TO LOBBY</Button>
      </div>
    )
}

GameInfo.propTypes = {
  game: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  name: PropTypes.string,
  password: PropTypes.string
};

export default GameInfo;