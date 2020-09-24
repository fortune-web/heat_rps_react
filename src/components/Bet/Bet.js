import React, {}from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './Bet.css';

const Bet = ({ bet, enterGame, loadGame }) => {

  const startGame = () => {
    enterGame(bet)
  }
    
  return (
    <Row className="mr-1 mb-3 justify-content-md-center">
      <Col md="auto" lg="12" className="Bet">
        <Row className="betid justify-content-md-center"># {bet.id}</Row>
        <Row md="auto" className="category account justify-content-md-center">ACCOUNT</Row>
        <Row className="justify-content-md-center">{bet.account_name1 || bet.account_id1 || '-'}</Row>

        <Row className="category amount justify-content-md-center">AMOUNT</Row>
        <Row className="justify-content-md-center">{bet.amount / 100000000} HEAT</Row>
        
        <Row className="category rounds justify-content-md-center">ROUNDS</Row>
        <Row className="justify-content-md-center">{bet.rounds}</Row>
        
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
      </Col>
    </Row>
  );
}

Bet.propTypes = {
  bet: PropTypes.object.isRequired,
  enterGame: PropTypes.func.isRequired,
  loadGame: PropTypes.func.isRequired,
};

export default Bet;
