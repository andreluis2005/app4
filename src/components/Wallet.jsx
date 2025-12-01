import React, { useState } from 'react'
import { ethers } from 'ethers'

export default function Wallet({ onConnect, address }){
  const [network, setNetwork] = useState(null)

  async function connect(){
    if(!window.ethereum){ alert('Please install MetaMask'); return }
    try{
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const net = await provider.getNetwork()
      setNetwork(net)
      onConnect(provider, accounts[0])
    }catch(e){
      console.error(e); alert('Connection failed: '+(e.message || e))
    }
  }

  return (
    <div className="row">
      {address ? (
        <div style={{textAlign:'right'}}>
          <div className="small">Connected</div>
          <div>{address}</div>
          <div className="small">Network: {network?.name||'unknown'}</div>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  )
}
