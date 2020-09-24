import React from 'react';

import PropTypes from 'prop-types';

import rock  from './images/set2/rock.png'
import paper from './images/set2/paper.png'
import scissor from './images/set2/scissor.png'
import question from './images/set2/question.png'
import './Element.css';


const Element = ({ element, move, password, play, active }) => {


  let image

  if (!element) return (
    <div className={'waiting'}>
    </div>
  )
  if (element === 'rock') image = rock
  if (element === 'paper') image = paper
  if (element === 'scissor') image = scissor
  if (element !== 'rock' && element !== 'paper' && element !== 'scissor') {
    element = '?'
  }
  if (element === '?') image = question

  return (
    <div className={active ? 'activeCard' : 'figure'}>
      <img 
        src={image} 
        className={element==='?' ? 'gray' : element} 
        alt={element.toUpperCase()} 
        name={element.toUpperCase()} 
        onClick={active ? ()=>play(element) : null}
      />
      <p>{ move ? move : null }</p>
      <p>{ password ? password : null }</p>
    </div>
  );
}

Element.propTypes = {
  element: PropTypes.string,
  move: PropTypes.string,
  password: PropTypes.string,
  play: PropTypes.func,
  active: PropTypes.bool,
};

export default Element;
