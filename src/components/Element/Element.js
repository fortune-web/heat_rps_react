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
import './Element.css';


const Element = ({ element, play }) => {

  let image
  if (element == 'rock') image = rock
  if (element == 'paper') image = paper
  if (element == 'scissor') image = scissor

  return (
    <div className="Element">
      <img src={image} onClick={()=>play(element)}/>
    </div>
  );
}

export default Element;
