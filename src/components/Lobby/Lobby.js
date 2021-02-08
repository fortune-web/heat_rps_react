import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Bet from '../Bet/Bet';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { stages, API_URL } from '../../config.js';
import './Lobby.css';

const Lobby = ({ enterGame, loadGame, bets, setStage, setBets, setGame }) => {

  const betsTimeout = useRef()

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
    let data = await resp.json()
    if(data.length < 5){
      const d = 5 / data.length
      let arr = []
      for(let i = 0; i <= d; i++) arr = [...arr, ...data]
      data = arr
    }
    if (data) {
      setBets(data)
      console.log(data)
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

    if (data) {
      setGame({
          id: data.game_id,
          pin: data.game_pin,
          message: data.message,
          rounds: params.rounds,
          amount: params.amount,
          status: 'CREATED',
          current_round: 1
      })
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

  const [ selectedArrIdx, setSelectedArrIdx ] = useState(0)
  const [ selectedIdx, setSelectedIdx ] = useState(0)
  const onSlideChange = (selectedIndex) => {
    let idx = selectedIndex % bets.length
    idx = idx < 0 ? bets.length + idx: idx
    setSelectedIdx(idx)
    setSelectedArrIdx(selectedIdx)
  }

  return (
    <Container className="Lobby">
      <Row className="justify-content-center">
      {bets && bets.length > 0 &&
        <Carousel
          arrows
          slidesPerScroll={1}
          slidesPerPage={5}
          infinite
          onChange={onSlideChange}
        >
         {bets.map((bet, index) => {
            return  <Col
              md="12"
              className={`bet__box bet__${selectedIdx > index ? index + bets.length - selectedIdx: index - selectedIdx}`}
              key={index}
            >
              <Bet
                bet={bet}
                enterGame={enterGame}
                loadGame={loadGame}
                selected={ selectedIdx > index ? index + bets.length - selectedIdx === 2 : index - selectedIdx === 2 }
                key={index}
                />
            </Col>
            })
          }
        </Carousel>
      }
      </Row>
      <Row className="pt-5 justify-content-center">
        <h3>START A NEW GAME</h3>
      </Row>
      <Row className="justify-content-center">
        <Col xs={8} md={6} className="lobby_input_container">
          <input type="text" id="amount" placeholder="Amount to bet" name="fname" className="lobby_input" />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={8} md={6} className="lobby_input_container">
          <select  id="rounds" className="lobby_input">
            <option value="5">Short (5 rounds)</option>
            <option value="10">Long (10 rounds)</option>
          </select>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={8} md={6} className="lobby_input_container">
          <select  id="private" defaultValue="0" className="lobby_input">
            <option value="1">Private</option>
            <option value="0">Public</option>
          </select>
        </Col>
      </Row>
      <Row className="pt-4 pb-4 justify-content-center">
        <Col lg xs={8} md={6}>
          <Button onClick={() => createGame()} className="lobby_button" variant="danger">MAKE BET</Button>
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
