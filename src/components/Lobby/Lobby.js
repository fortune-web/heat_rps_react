import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

import httpClient from '../../helpers/axios';

import Bet from '../Bet/Bet';

import './Lobby.css';
import { config, stages, API_URL } from '../../config.js';

const Lobby = ({ enterGame, loadGame, account, bets, stage, setStage, setBets, game, setGame }) => {

  var betsTimeout
  
  useEffect(() => {
    fetchBets()
    return () => {
      clearTimeout(betsTimeout)
    }
  }, [])


  const fetchBets = async() => {

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

    betsTimeout = setTimeout(fetchBets,5000)
  }

const createGame = async () => {

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

  return (

    <div className="Lobby">
    { 
    bets && bets.length > 0 && 
      bets.map((bet) => {
        return <Bet 
          bet={bet}
          enterGame={enterGame}
          loadGame={loadGame}
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
      <div>
        <select id="private" type="text" className="inpRounds" >
          <option value="1">Private</option>
          <option value="0" selected>Public</option>
        </select> 
      </div>
      </p>
    <p><input className="inputButton" type="button" onClick={() => createGame()} value="MAKE BET" /></p>
    </div>
  );
}

export default Lobby;
