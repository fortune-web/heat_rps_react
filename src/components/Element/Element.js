import React from 'react';

import PropTypes from 'prop-types';

import rock  from './images/set3/rock.png'
import paper from './images/set3/paper.png'
import scissor from './images/set3/scissor.png'
import question from './images/set2/question.png'
import './Element.css';


const Element = ({ element, move, win, play, active }) => {

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
    <div className={active ? 'activeCard' : `figure figure_${win && element !== '?' ? win : ''}`}>
      { element !== '?' &&
        <img
          src={image}
          className='card_img'
          alt={element.toUpperCase()}
          name={element.toUpperCase()}
          onClick={active ? ()=>play(element) : null}
        />
      }
      { element === '?' && <h5>?</h5> }
    </div>
  );
}

Element.propTypes = {
  element: PropTypes.string,
  move: PropTypes.string,
  win: PropTypes.string,
  play: PropTypes.func,
  active: PropTypes.bool,
};

export default Element;
