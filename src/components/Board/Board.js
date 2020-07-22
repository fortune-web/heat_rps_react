import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

// heat Game Library
import HGame from '@ethernity/heat-games';

import httpClient from '../../helpers/axios';


// Components
import Element from '../Element/Element';

import './Board.css';
import { stages } from '../../config.js';

import crypto from 'crypto';


const Board = ({ 
  stage, setStage, 
  game, setGame, 
  moves, setMoves,
  round, setRound,
  opponentMoves, setOpponentMoves, 
  account, 
  player
}) => {

  const [ waiting, setWaiting ] = useState(false)
  const [ password, setPassword ] = useState('')
  var refSubscriber = useRef(null)

  const play = async (element) => {

    if ( element === '?' ) return

    // if ( player === 2 ) {
      let message = HGame.aesEncrypt(element, password)
      message = JSON.stringify({
        move: message
      })
      const vars = {
        card: message,
        account: account,
        opponent: game.opponent,
      }
      console.log("VARS:", vars)

      const data = await HGame.makeMove(vars);
      console.log("DATA:", data)

      if ( data && data.errorCode ) {
        alert(data.errorDescription)
        return
      }

      if ( data && data.broadcasted ) {
        // Success, move sent
        let _moves = moves;
        _moves.push({
          card: element,
          password,
          message
        })
        // setMoves(_moves)

        const params = {
          game_id: game.id,
          account_id: account.id,
          move: message,
          password: password,
          round: game.current_round,
          player,
          blockchain_hash: data.fullHash
        }

        console.log("MOVEPOST:", params)
        const resp = await fetch('http://localhost:3010/move', {
          method: 'POST',
          body: JSON.stringify(params), 
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log("MOVED:", resp)
        if(resp && resp.ok) {
          setWaiting(true)
        } else {
          alert("CONNECTION ERROR")
        }



      } else {
        // Failure
        alert("There was an error trying to broadcast the move")
        return
      }

  //  }
  }



  const waitForPlayer1 = async (m) => {

    console.log("M:", m)

    if (m && m.sender === account.opponent) {

      let message = await HGame.readMessage(m, account.secret)
      console.log("RECEIVED:", message)
      message = JSON.parse(message)
      if (!message.password) {
        setOpponentMoves({
          player1Move: message.move
        })
      }
      if (refSubscriber) {
        refSubscriber.close()
        refSubscriber = null
      }
    }
  }


  const updatePassword = (e) => {
    setPassword(e.target.value)
  }

  const generatePassword = (length) => {
    return crypto.randomBytes(length).toString('base64').slice(0,-1)
}

  const showWinner = (playerCard, opponentCard) => {
    if (!opponentCard) return
    if (playerCard === opponentCard) return 'DRAW'
    if (playerCard === 'rock' && opponentCard === 'scissor') return 'YOU WIN'
    if (playerCard === 'rock' && opponentCard === 'paper') return 'YOU LOSE'
    if (playerCard === 'paper' && opponentCard === 'rock') return 'YOU WIN'
    if (playerCard === 'paper' && opponentCard === 'scissor') return 'YOU LOSE'
    if (playerCard === 'scissor' && opponentCard === 'paper') return 'YOU WIN'
    if (playerCard === 'scissor' && opponentCard === 'rock') return 'YOU LOSE'
  }


  const listenMoves = async () => {

    const params = {
        game_id: game.id,
        account_id: account.id,
        player: (player === 1) ? 2 : 1,
    }

    const resp = await fetch('http://localhost:3010/listen', {
      method: 'POST',
      body: JSON.stringify(params), 
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await resp.json()

    if ( !data ) {
      alert("LISTENING CONNECTION ERROR")
    }

    if (player === 1) {
      setOpponentMoves(data.player2)
      setMoves(data.player1)
    } else {
      setOpponentMoves(data.player1)
      setMoves(data.player2)
    }

    setGame({
      ...game,
      current_round: Math.max(data.player1.length, data.player2.length)
    })
    setTimeout(listenMoves, 5000)

  }


  const showCards = () => {

      let resp = []
      for(round = 0; round < game.current_round; round++) {
         resp.push (
            <div className="roundsInfo" key={round}>
              <div className="roundRound">
                <p>Round {round + 1}</p>
              </div>
              <div className="roundItem">
                <span className="roundName">YOU</span>
                <Element element={moves[round] ? moves[round].card : null} active={false}
                />
              </div>
              <div className="roundItem">
                <span className="roundName">OPPONENT</span>
                <Element element={opponentMoves[round] ? opponentMoves[round].card : null} active={false} />
              </div>
              <div className="roundWinner">
                <p>{showWinner(moves[round]?.card, opponentMoves[round]?.card)}</p>
              </div>
            </div>   
          )
        }
      return resp
      }

  useEffect(() => {
    setPassword(generatePassword(14))
    refSubscriber = HGame.subscribe('messages', waitForPlayer1)
  }, [ game.round ])

  useEffect(() => {
    console.log("CHECKING STATE:", stage, stages.STARTED)
    if ( stage === stages.STARTED && game.id ) {
      listenMoves()
    }
  }, [])



  // console.log("MOVES:", moves)

  return (
    <div className="Board">

      <div className="gameInfo">
        <div className="listItem">
          <span className="listName">Game Id</span>
          <span className="listData">{game.id}</span>
        </div>
        <div className="listItem">
          <span className="listName">Opponent Id</span>
          <span className="listData">{player === 1 ? (game.opponent || 'WAITING') : game.account_id}</span>
        </div>
        <div className="listItem">
          <span className="listName">Bet amount</span>
          <span className="listData">{game.amount} HST</span>
        </div>
        <div className="listItem">
          <span className="listName">Number of rounds</span>
          <span className="listData">{game.rounds}</span>
        </div>
      </div>

      <h2>Round
      <span className="roundNumber">{game.current_round}</span></h2>
      { 
      game.current_round <= game.rounds &&
        <div className="playerBoard">
          <h1>Make your move</h1>
          <div className="selectInfo">
            <Element element='rock' play={play} active={true} />
            <Element element='paper' play={play} active={true} />
            <Element element='scissor' play={play} active={true} />
            <p>Select rock, paper or scissor</p>
          </div>
        </div>
      }
      <div className="movesInfo">
      {
        showCards()
      }
      </div>

      { 
      1==2 &&
        <div className="passwordInfo">
          <p>Password to encrypt your move (you can change it)</p>
          <input className="passwordInput" type="text" value={ password } onChange={ (e) => updatePassword(e) }/>
        </div>
      }

    </div>
  );
}

export default Board;
