import React, { 
  useEffect,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import Bet from '../Bet/Bet';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import './Lobby.css';
import { stages, API_URL } from '../../config.js';

const Lobby = ({ enterGame, loadGame, bets, setStage, setBets, setGame }) => {

  var betsTimeout = useRef()
  
  const fetchBets = useCallback(async() => {

    const params = {
      filter: 'all'
    }

    const resp = await fetch(API_URL + 'bets', {
      method: 'POST',
      body: JSON.stringify(params),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await resp.json()

    if (data) {
      setBets(data)
      console.log("BETS:", data)
    } else {
      alert("BETS CONNECTION ERROR")
    }

    betsTimeout.current = setTimeout(fetchBets,5000)
  }, [setBets])

const createGame = async () => {

    if (document.getElementById('amount').value === "" || document.getElementById('amount').value === "0") {
      alert("Please fill an amount to bet")
      return
    }
    const params = {
      amount: document.getElementById('amount').value * 100000000,
      rounds: document.getElementById('rounds').value,
      private: document.getElementById('private').value,
    }

    const formData = new FormData()
    formData.append('amount', params.amount)
    formData.append('rounds', params.rounds)
    formData.append('private', params.private)

    const resp = await fetch(API_URL + 'createGame', {
      method: 'POST',
      body: JSON.stringify(params),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await resp.json()

    console.log("CREATEGAME:", data)

    if (data) {
/*      const bet = {
        id: data.game_id,
        game_pin: data.game_pin,
        amount: params.amount,
        rounds: params.rounds,
        private: params.private,
        status: data.status
      }*/
     // setBets(bet)
      setGame({
          id: data.game_id,
          pin: data.game_pin,
          rounds: params.rounds,
          amount: params.amount,
          status: 'CREATED',
          current_round: 1
      })
      // loadGame(bet)
      setStage(stages.CREATED)
    } else {
      alert("CONNECTION ERROR")
    }

}


  useEffect(() => {
    fetchBets()
    return () => {
      clearTimeout(betsTimeout.current)
    }
  }, [fetchBets])



  return (

    <Container fluid="md" className="Lobby">
      <Row className="justify-content-center">
      { 
      bets && bets.length > 0 && 
        bets.map((bet, index) => {
          return <Col lg="2">
            <Bet 
              bet={bet}
              enterGame={enterGame}
              loadGame={loadGame}
              key={index}
              />
          </Col>
        })
      }
      </Row>
      <Row className="pt-5 justify-content-center">
        <h5>Start a new game</h5>
      </Row>
      <Row className="justify-content-center">
        <Col xs={8} md={6} className="p-2">
          <Form.Control type="text" placeholder="Amount to bet" id="amount" className="inpAmount" />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={8} md={6} className="p-2">
          <Form.Control as="select" id="rounds" type="text" className="inpRounds" >
            <option value="5">Short (5 rounds)</option>
            <option value="10">Long (10 rounds)</option>
          </Form.Control> 
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={8} md={6} className="p-2">
          <Form.Control as="select" defaultValue="0" id="private" type="text">
            <option value="1">Private</option>
            <option value="0">Public</option>
          </Form.Control> 
        </Col>
      </Row>
      <Row className="pt-4 pb-4 justify-content-center">
        <Col lg xs={8} md={6}>
          <Button onClick={() => createGame()} >MAKE BET</Button>
        </Col>
      </Row>
    </Container>
  );
}

Lobby.propTypes = {
  enterGame: PropTypes.func,
  loadGame: PropTypes.func,
  bets: PropTypes.array,
  setStage: PropTypes.func,
  setBets: PropTypes.func,
  setGame: PropTypes.func,
};

export default Lobby;
