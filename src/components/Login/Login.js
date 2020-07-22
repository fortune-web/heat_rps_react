import React, { 
  lazy,
  useRef,
  useState, 
  useEffect,
  useLayoutEffect,
} from 'react';

import httpClient from '../../helpers/axios';

import Bet from '../Bet/Bet';

import './Login.css';
import { config, stages } from '../../config.js';

const Login = ({ account, setAccount, setStage, changeAccount }) => {

  const updateAccount = () => {
    setAccount(
      {
        name: document.getElementById('name').value,
        secret: document.getElementById('secret').value,
        id: document.getElementById('id').value
      })
  }

  return (
    <div className="Login">
      <h1>LOGIN</h1>
  
      <p><input type="button" onClick={() => changeAccount(1)} value="SET ACCOUNT 1" /><br /><input type="button" onClick={() => changeAccount(2)} value="SET ACCOUNT 2" /></p>
  
      <p>Your account</p>
      <p>
      <input placeholder="Account Name (email)" id="name" type="text" className="inpName" onChange={()=>updateAccount()} value={account.name || ''} />
      </p>
      <p>
      <input placeholder="Secret phrase" id="secret" type="text" className="inpSecret" onChange={()=>updateAccount()} value={account.secret || ''} /> 
      </p>
      <p>
      <input placeholder="Id" id="id" type="text" className="inpId" onChange={()=>updateAccount()} value={account.id || ''} /> 
      </p>
      <p><input type="button" onClick={() => setStage(stages.LOBBY)} value="ENTER" /></p>
    </div>
  );
}

export default Login;
