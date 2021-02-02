import React, {}from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './Bet.css';

const Bet = ({ bet, enterGame, loadGame, selected }) => {

  const startGame = () => {
    enterGame(bet)
  }

  return (
    <div className="bet__container">
      <Row className="mb-3 justify-content-center"  className={selected ? 'bet bet__selected': 'bet'}>
        <Col xs="12" sm="12" md="12" lg="12" className="h-100">
          <Row className="bet_id"># {bet.id}</Row>
          <Row md="auto" className="bet_item_title">ACCOUNT</Row>
          <Row className="bet_item_value">{bet.account_name1 || bet.account_id1 || '-'}</Row>

          <Row className="bet_item_title">AMOUNT</Row>
          <Row className="bet_item_value">{bet.amount / 100000000} HEAT</Row>

          <Row className="bet_item_title">ROUNDS</Row>
          <Row className="bet_item_round">{bet.rounds}</Row>

        </Col>
      </Row>
      <div className="">
      {
        (bet.status === 'FINISHED') &&
          <input type="button" className="bet_item_submit" onClick={() => loadGame(bet)} value="FINISHED" />
      }
      {
          (bet.status === 'FUNDED' || bet.status === 'CREATED') &&
            <input type="button" className="bet_item_submit" onClick={() => startGame()} value="NEW GAME" />
      }
      {
          (bet.status === 'STARTED') &&
            <input type="button" className="bet_item_submit" onClick={() => loadGame(bet)} value="CONTINUE" />
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
