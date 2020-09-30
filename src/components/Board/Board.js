import React, {
  useState, 
  useEffect,
  useRef,
  useCallback,
} from 'react';

import PropTypes from 'prop-types';

// heat Game Library
import HGame from '@ethernity/heat-games';

// Components
import Element from '../Element/Element';
import Encrypter from '../Encrypter/Encrypter';
import GameInfo from '../GameInfo/GameInfo';

import './Board.css';
import { stages, API_URL } from '../../config.js';

import crypto from 'crypto';

HGame.Config({isTestnet: true})

const Board = ({ 
  stage, setStage, 
  game, setGame, 
  moves, setMoves,
  round,
  opponentMoves, setOpponentMoves, 
  account, setAccount,
  player
}) => {

  const [ waiting, setWaiting ] = useState(false) // To wait for the own move to be sent
  const [ password, setPassword ] = useState('')

  var listenTimeout = useRef()

  const play = async (element) => {

    if ( element === '?' ) return

    if ( game.current_round <= moves.length ) {
      alert("Wait for your opponent to move")
      return
    }

    if ( waiting ) {
      alert("We are sending your move to the blockchain")
      return
    }

    setWaiting(true)

    let message = HGame.aesEncrypt(element, password)

    let messageJson = JSON.stringify({
      game_id: game.id,
      move: message
    })

    let _moves = moves;
    _moves.push({
      card: element,
      password,
      message
    })

    const params = {
      game_id: game.id,
      account_id: account.id,
      account_password: account.password,
      move: messageJson,
      password: password,
      round: game.current_round,
      player,
      card: element,
    }

    try {
      const resp = await fetch(API_URL + 'move', {
        method: 'POST',
        body: JSON.stringify(params), 
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (resp && resp.ok) {
        setPassword(generatePassword(14))
        const data = await resp.json()
        if (data.finished) {
          setStage(stages.FINISHED)
          setGame(prevGame => ({
            ...prevGame,
            status: 'FINISHED',
            winner: data.winner
          }))
        }
      } else { // Resp not ok
        alert("Move data error")
      }
      setWaiting(false)
    } catch(e) {
      alert("Error sending the move:", e)
      setWaiting(false)
      return
    }

  }

  const updatePassword = e => {
    setPassword(e.target.value)
  }

  const generatePassword = length => {
    return crypto.randomBytes(length).toString('hex').slice(0,-1)
  }

  const showWinner = (playerCard, opponentCard) => {
    if (!opponentCard) return {
      text: null,
      letter: ''
    }
    if (playerCard === opponentCard) return {
      text: 'DRAW',
      letter: 'D',
    }
    if (playerCard === 'rock' && opponentCard === 'scissor') return {
      text: 'YOU WIN',
      letter: 'W',
    }
    if (playerCard === 'rock' && opponentCard === 'paper') return {
      text: 'YOU LOSE',
      letter: 'L',
    }
    if (playerCard === 'paper' && opponentCard === 'rock') return {
      text: 'YOU WIN',
      letter: 'W',
    }
    if (playerCard === 'paper' && opponentCard === 'scissor') return {
      text: 'YOU LOSE',
      letter: 'L',
    }
    if (playerCard === 'scissor' && opponentCard === 'paper') return {
      text: 'YOU WIN',
      letter: 'W',
    }
    if (playerCard === 'scissor' && opponentCard === 'rock') return {
      text: 'YOU LOSE',
      letter: 'L',
    }
    return {
      text: null,
      letter: ''
    }
  }


  const listenMoves = useCallback(async () => {

    const params = {
        game_id: game.id,
        player: game.player,
        account_password: account.password,
    }

    const resp = await fetch(API_URL + 'listen', {
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

    let _current_round = Math.max(data.player1.length, data.player2.length)
    if (data.player1.length === data.player2.length && data.status !== 'FINISHED') _current_round++
    if (_current_round > game.rounds) _current_round = game.rounds

    setGame(prevGame => ({
      ...prevGame,
      status: data.status,
      current_round: _current_round,
      winner: data.winner
    }))
    setStage((data.status === 'CREATED') ? stages.CREATED : (data.status === 'FINISHED') ? stages.FINISHED : stages.STARTED)
 

    if (data.status === 'STARTED' || data.status === 'CREATED') {
      listenTimeout.current = setTimeout(listenMoves, 5000)
    }

  } )


  const resetGame = () => {
    setGame(null)
    setAccount({})
    setStage(stages.LOBBY)
  }

  const showCards = () => {
    if (!moves || !opponentMoves) return
    let resp = []
    for(round = 0; 
      round < game.current_round && 
      round <= game.rounds &&
      ((round < opponentMoves.length && round < moves.length) || game.status === 'STARTED'); 
      round++) {
      
        let winner = showWinner(moves[round]?.card, opponentMoves[round]?.card)
        resp.push (
          <div className={"roundsInfo" + winner.letter} key={round}>
            <div className="roundRound">
              <p>Round {round + 1}</p>
            </div>
            <div className="roundWinner">
              <p>{winner.text}</p>
            </div>
            <div className="roundItem">
              <span className="roundName">YOU</span>
              <Element element={moves[round] ? moves[round].card : null} active={false}
              />
            </div>
            <div className="roundItem">
              <span className="roundName">OPPONENT</span>
              <Element 
              element={opponentMoves[round] ? opponentMoves[round].card : null} 
              move={opponentMoves[round] ? opponentMoves[round].move : null}
              password={opponentMoves[round] ? opponentMoves[round].password : null}
              active={false} />
            </div>
          </div>   
        )
      }
    return resp
  }

  useEffect(() => {
    setPassword(generatePassword(14))
    return () => {
      clearTimeout(listenTimeout.current)
    }
  }, [])


  useEffect(() => {
    listenMoves()
  }, [game.opponent])


  let winner = 'L'
  if (game.winner === player) winner = 'W'
  if (game.winner === 3) winner = 'D'

  return (
    <div className="Board">

      <GameInfo game={game}/>
      
      <h2>Welcome <span className='name'>{account.name}</span></h2>
      <p>Password to reenter</p>
      <p>{account.password}</p>

      <button onClick={()=>resetGame()}>BACK TO LOBBY</button> 
      {
        stage === stages.FINISHED &&
        <div className={'finalBoard' + winner}>
          <h2>GAME FINISHED</h2>
          <h2>{ (game.winner === 3) ? 'IT IS A DRAW!' : (game.winner === player) ? 'YOU WON THE GAME!' : 'YOU LOSE THE GAME!' }</h2>
        </div>
      }
      { (stage === stages.STARTED || stage === stages.FINISHED) && // Once game started
        <div>
          <h2>Round
          <span className="roundNumber">{(game.current_round <= game.rounds) ? game.current_round : game.rounds}</span></h2>
          { 
          stage === stages.STARTED &&
            <div className="playerBoard">
              <h1>Make your move</h1>
              <div className="selectInfo">
                <Element element='rock' play={play} active={true} />
                <Element element='paper' play={play} active={true} />
                <Element element='scissor' play={play} active={true} />

              </div>
            </div>
          }
          <div className="movesInfo">
          {
            showCards()
          }
          </div>

          { 
          stage === stages.STARTED &&
            <div className="passwordInfo">
              <p>Password to encrypt your move (you can change it)</p>
              <input className="passwordInput" type="text" value={ password } onChange={ (e) => updatePassword(e) }/>
            </div>
          }
        </div>
      }
      {
        stage === stages.CREATED && 
        <div>
          <h2>Waiting for an opponent to join</h2>
        </div>
      }
      <Encrypter />
    </div>
  );
}


Board.propTypes = {
  stage: PropTypes.number.isRequired,
  setStage: PropTypes.func.isRequired,
  game: PropTypes.object,
  setGame: PropTypes.func,
  moves: PropTypes.array,
  setMoves: PropTypes.func,
  round: PropTypes.object,
  opponentMoves: PropTypes.array,
  setOpponentMoves: PropTypes.func,
  account: PropTypes.object,
  setAccount: PropTypes.func,
  player: PropTypes.number,
};

export default Board;
