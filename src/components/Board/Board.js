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
import Encrypter from '../Encrypter/Encrypter';
import GameInfo from '../GameInfo/GameInfo';

import './Board.css';
import { stages, API_URL } from '../../config.js';

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

  const [ waiting, setWaiting ] = useState(false) // To wait for the own move to be sent
  const [ password, setPassword ] = useState('')
  const [ opponentName, setOpponentName ] = useState('WAITING')

  var refSubscriber = useRef(null)

  var listenTimeout
  var waitTimeout

  const play = async (element) => {

    console.log("PLAY........................")
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
      move: message
    })

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
          account_password: account.password,
          move: messageJson,
          password: password,
          round: game.current_round,
          player,
          card: element,
        }

        console.log("MOVEPOST:", params)
        const resp = await fetch(API_URL + 'move', {
          method: 'POST',
          body: JSON.stringify(params), 
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log("MOVED:", resp)
        if(resp && resp.ok) {

          const data = await resp.json()

          console.log("MOVERESULT:", data)

          if ( data.finished ) {
            // Game ended
            setStage(stages.FINISHED)
            setGame(prevGame => ({
              ...prevGame,
              status: 'FINISHED',
              winner: data.winner
            }))
          }


        } else {
          alert("MOVE CONNECTION ERROR")
        }
        setWaiting(false)

  }

  const waitForOpponent = async () => {
    console.log("WAIT..............................")

    const params = {
        game_id: game.id,
        account_id: account.id
    }

    const resp = await fetch(API_URL + 'wait', {
      method: 'POST',
      body: JSON.stringify(params), 
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await resp.json()

    if ( !data ) {
      alert("WAITING CONNECTION ERROR")
    }

    if ( data.status === 'CREATED' ) {
      waitTimeout = setTimeout(waitForOpponent, 5000)
      return
    }

    if ( data.status === 'STARTED' ) {
      setGame(prevGame => ({
        ...prevGame,
        opponent_id: data.opponent_id,
        opponent_name: data.opponent_name,
        status: 'STARTED',
        current_round: 1
      }))
      setStage(stages.STARTED)
      listenMoves()
    } 

  }

  const waitForPlayer1 = async (m) => {

    console.log("PLAYER1............................", m)

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
    console.log("LISTEN...................")
    console.log("game:", game)
    console.log("stage:", stage)

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

    console.log("LISTEN:", data)
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
      listenTimeout = setTimeout(listenMoves, 5000)
    }

  }

  const resetGame = () => {
    setGame(null)
    setStage(stages.LOBBY)
  }

  const getName = async (id) => {
    const account = await HGame.getAccountById(id)
    return account.publicName
  }

  const showCards = () => {
    if (!moves || !opponentMoves) return
    let resp = []
    for(round = 0; 
      round < game.current_round && 
      round <= game.rounds &&
      ((round < opponentMoves.length && round < moves.length) || game.status === 'STARTED'); 
      round++) {
      
      // console.log("Gstatus:", game.status)

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
              <Element 
              element={opponentMoves[round] ? opponentMoves[round].card : null} 
              move={opponentMoves[round] ? opponentMoves[round].move : null}
              password={opponentMoves[round] ? opponentMoves[round].password : null}
              active={false} />
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
    const setOpName = async() => {
      if ( player === 1 ) {
        setOpponentName(await getName(game.opponent_name) || 'WAITING')
      } else {
        setOpponentName(await getName(game.account_id))
      }
    }
    setOpName()
    listenMoves()
  }, [game.opponent])


  useEffect(() => {
    return () => {
      clearTimeout(listenTimeout)
      clearTimeout(waitTimeout)
    }
  }, [])

  useEffect(() => {
    setPassword(generatePassword(14))
    // refSubscriber = HGame.subscribe('messages', waitForPlayer1)
  }, [ game.current_round ])

  useEffect(() => {
    // refSubscriber = HGame.subscribe('messages', waitForPlayer1)
  }, [ game ])

  useEffect(() => {
    console.log("CHECKING status:", stage, stages.STARTED)
    if ( stage === stages.STARTED && game.id ) {
      // listenMoves()
    }
    console.log("CHECKING IF WAIT")
    if ( stage === stages.CREATED && game.id ) {
      console.log("WAITING")
      waitForOpponent()
    }
  }, [stage])



  // console.log("MOVES:", moves)

  return (
    <div className="Board">

      <GameInfo game={game}/>

      <Encrypter />
      
      <h2>Welcome <span className='name'>{account.name}</span></h2>

      <button onClick={()=>resetGame()}>BACK TO LOBBY</button> 
      {
        stage === stages.FINISHED &&
        <div className='finalBoard'>
          <h2>GAME FINISHED</h2>
          <h2>{ (game.winner === 0) ? 'IT IS A DRAW!' : (game.winner === player) ? 'YOU WON THE GAME!' : 'YOU LOSE THE GAME!' }</h2>
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
    </div>
  );
}

export default Board;
