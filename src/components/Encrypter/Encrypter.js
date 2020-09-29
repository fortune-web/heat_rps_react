import React from 'react';

// heat Game Library
import HGame from '@ethernity/heat-games';

// Components
import './Encrypter.css';

HGame.Config({isTestnet: true})


const Encrypter = () => {

  const encrypt = () => {
    document.getElementById('encryptedResult').innerText = HGame.aesEncrypt(
      document.getElementById('decmessage').value, 
      document.getElementById('encpassword').value
    )

  }

  const decrypt = () => {

    try {
      document.getElementById('decryptedResult').innerText = HGame.aesDecrypt(
        document.getElementById('encmessage').value, 
        document.getElementById('decpassword').value
      )
    }
    catch(e) {
      document.getElementById('decryptedResult').innerText = 'ERROR'
    }

  }

  return (
    <div>
    <p>Here you can verify that your opponent moves are correctly decrypted when the password is revealed</p>
      <span className='section'>
          <input className='encInput' type='text' placeholder='Encrpyted text' id='encmessage' />
          <input className='encPassword' type='text' placeholder='Password' id='decpassword' />
          <button className='encButton' value='Decrypt' onClick={decrypt}>Decrypt</button>
          <span className='encResult' id='decryptedResult' />
      </span>
      <span className='section'>
          <input className='encInput' type='text' placeholder='Message' id='decmessage' />
          <input className='encPassword' type='text' placeholder='Password' id='encpassword' />
          <button className='encButton' value='Encrypt' onClick={encrypt}>Encrypt</button>
          <span className='encResult' id='encryptedResult' />
      </span>
    </div>
  )

}

export default Encrypter;
