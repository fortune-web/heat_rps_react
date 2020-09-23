import React from 'react';
import PropTypes from 'prop-types';

import './Login.css';
import { stages } from '../../config.js';

const Login = ({ account, setAccount, setStage, changeAccount }) => {

  const updateAccount = () => {
    setAccount(
      {
        secret: document.getElementById('secret').value,
      })
  }

  return (
    <div className="Login">
      <h1>LOGIN</h1>
  
      <p><input type="button" onClick={() => changeAccount(1)} value="SET ACCOUNT 1" /><br /><input type="button" onClick={() => changeAccount(2)} value="SET ACCOUNT 2" /></p>
  
      <p>Your account</p>
      <p>
      <input placeholder="Secret phrase" id="secret" type="text" className="inpSecret" onChange={()=>updateAccount()} value={account.secret || ''} /> 
      </p>
      <p><input type="button" onClick={() => setStage(stages.LOBBY)} value="ENTER" /></p>
    </div>
  );
}


Login.propTypes = {
  account: PropTypes.object,
  setAccount: PropTypes.object,
  setStage: PropTypes.object,
  changeAccount: PropTypes.func,
};

export default Login;
