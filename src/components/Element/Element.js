import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';
import rock  from './images/set2/rock.png'
import paper from './images/set2/paper.png'
import scissor from './images/set2/scissor.png'
import question from './images/set2/question.png'
import './Element.css';


const Element = ({ element, play, active }) => {

  let image
  if (element == 'rock') image = rock
  if (element == 'paper') image = paper
  if (element == 'scissor') image = scissor
  if (element != 'rock' && element != 'paper' && element != 'scissor') element = '?'
  if (element === '?') image = question

  return (
    <div className={active ? 'activeCard' : 'card'}>
      <img src={image} alt={element.toUpperCase()} name={element.toUpperCase()} className={element==='?' ? 'gray' : element} onClick={()=>play(element)}/>
    </div>
  );
}

export default Element;
