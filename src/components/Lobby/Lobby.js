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
import { config } from '../../config.js';

const Lobby = ({ enterGame, loadGame, account, bets, setBets }) => {

  useEffect(() => {
    const fetchBets = async() => {
      console.log("ACCC:", account)

      const params = {
        account_id: account.id
      }

      const resp = await fetch('http://localhost:3010/bets', {
        method: 'POST',
        body: JSON.stringify(params),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await resp.json()

      if (data && data.length) {
        setBets(data)
        console.log("BETS:", data)
      } else {
        alert("CONNECTION ERROR")
      }
    }
    fetchBets()
  }, [])


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
    const resp = await fetch('http://localhost:3010/bet', {
      method: 'POST',
      body: JSON.stringify(params),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log("CREATEGAME:", resp)
    if (resp) {
      setBets({
        id: resp.insertId,
        amount: params.amount,
        rounds: params.rounds,
        account_id: account.id
      })
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
