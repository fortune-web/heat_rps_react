import React, { 
  useEffect,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import Bet from '../Bet/Bet';

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

    <div className="Lobby">
    { 
    bets && bets.length > 0 && 
      bets.map((bet, index) => {
        return <Bet 
          bet={bet}
          enterGame={enterGame}
          loadGame={loadGame}
          key={index}
          />
      })
    }
      <p>
      <input placeholder="Amount to bet" id="amount" type="text" className="inpAmount" />
      </p>
      <p>
      <select id="rounds" type="text" className="inpRounds" >
        <option value="5">Short (5 rounds)</option>
        <option value="10">Long (10 rounds)</option>
      </select> 
      </p>
      <p>
        <select defaultValue="0" id="private" type="text" className="inpRounds" >
          <option value="1">Private</option>
          <option value="0">Public</option>
        </select> 
      </p>
    <p><input className="inputButton" type="button" onClick={() => createGame()} value="MAKE BET" /></p>
    </div>
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
