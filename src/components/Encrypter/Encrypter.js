import React from 'react';
// heat Game Library
import HGame from '@ethernity/heat-games';
// Components
import Button from 'react-bootstrap/Button';
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
      <div className='section'>
        <div style={{display:'flex', justifyContent:'center'}}>
          <input className='encInput' type='text' placeholder='Encrpyted text' id='encmessage' />
          <input className='encInput' type='text' placeholder='Password' id='decpassword' />
          <Button className='encButton' variant="danger" value='Decrypt' onClick={decrypt}>Decrypt</Button>
        </div>
        <div className='encResult' id='decryptedResult' />
      </div>
      <div className='section'>
        <div style={{display:'flex', justifyContent:'center'}}>
          <input className='encInput' type='text' placeholder='Message' id='decmessage' />
          <input className='encInput' type='text' placeholder='Password' id='encpassword' />
          <Button className='encButton' variant="danger" value='Encrypt' onClick={encrypt}>Encrypt</Button>
        </div>
        <div className='encResult' id='encryptedResult' />
      </div>
    </div>
  )

}

export default Encrypter;
