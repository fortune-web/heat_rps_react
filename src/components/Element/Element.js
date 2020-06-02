import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';
import rock  from './images/rock.png'
import paper from './images/paper.png'
import scissor from './images/scissor.png'
import question from './images/question.png'
import './Element.css';


const Element = ({ element, play }) => {

  let image
  if (element == 'rock') image = rock
  if (element == 'paper') image = paper
  if (element == 'scissor') image = scissor
  if (element != 'rock' && element != 'paper' && element != 'scissor') element = '?'
  if (element === '?') image = question

  return (
    <div className="Element">
      <img src={image} alt={element.toUpperCase()} name={element.toUpperCase()} className={element==='?' ? 'gray' : ''} onClick={()=>play(element)}/>
    </div>
  );
}

export default Element;
