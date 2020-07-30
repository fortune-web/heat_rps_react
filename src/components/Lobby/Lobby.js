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

const Lobby = ({ enterGame, loadGame, account, bets, stage, setBets }) => {

  var betsTimeout
  
  useEffect(() => {
    fetchBets()
    return () => {
      clearTimeout(betsTimeout)
    }
  }, [])


  const fetchBets = async() => {
    console.log("ACCC:", account)

    const params = {
      account_id: account.id
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
      amount: document.getElementById('amount').value,
      rounds: document.getElementById('rounds').value,
      account_id: account.id
    }
    
    const formData = new FormData()
    formData.append('amount', params.amount)
    formData.append('rounds', params.rounds)
    formData.append('acount_id', params.account_id)

    console.log("PREVBET:", params)
    const resp = await fetch(API_URL + 'bet', {
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
      const bet = {
        id: data.insertId,
        amount: params.amount,
        rounds: params.rounds,
        account_id: account.id,
        state: 'CREATED'
      }
      setBets(bet)
      loadGame(bet)
    } else {
      alert("CONNECTION ERROR")
    }

}

  return (

    <div className="Lobby">
    <h2>Welcome <span className='name'>{account.name}</span></h2>
    { 
    bets && bets.length > 0 && 
      bets.map((bet) => {
        return <Bet 
          bet={bet}
          account={account}
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
      </p>
    <p><input className="inputButton" type="button" onClick={() => createGame()} value="MAKE BET" /></p>
    </div>
  );
}

export default Lobby;
