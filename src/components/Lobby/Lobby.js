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

const Lobby = ({ enterGame, account, bets, setBets }) => {

  useEffect(() => {

    httpClient.apiGet('bets', {
      params: {
      }, 
    }).then(({ data }) => {
      if(data && data.length) {
        setBets(data)
      } else {
        alert("CONNECTION ERROR")
      }
    })

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

  console.log("BETS:", bets)
  return (
    <div className="Lobby">
    { 
    bets && bets.length > 0 && 
      bets.map((bet) => {
        return <Bet 
          key={bet.id}
          bet={bet}
          account={account}
          enterGame={enterGame}
          />
      })
    }
      <p>
      <input placeholder="Amount to bet" id="amount" type="text" className="inpAmount" />
      </p>
      <p>
      <input placeholder="Number of rounds" id="rounds" type="text" className="inpRounds" /> 
      </p>
    <p><input className="inputButton" type="button" onClick={() => createGame()} value="MAKE BET" /></p>
    </div>
  );
}

export default Lobby;
