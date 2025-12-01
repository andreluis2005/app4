import React, { useEffect, useState } from 'react'
import Wallet from './components/Wallet'
import Portfolio from './components/Portfolio'

export default function App(){
  const [provider, setProvider] = useState(null)
  const [address, setAddress] = useState(null)

  useEffect(()=>{
    if(window.ethereum){
      window.ethereum.on('accountsChanged', (accounts)=>{
        setAddress(accounts[0]||null)
      })
    }
  },[])

  return (
    <div className="container">
      <div className="header">
        <h1>Base Finance — Mini Portfolio</h1>
        <Wallet onConnect={(p,addr)=>{setProvider(p); setAddress(addr)}} address={address} />
      </div>

      <div className="card">
        <h3>Summary</h3>
        <p className="small">This demo connects to MetaMask (Base compatible) and reads ETH + ERC-20 balances for the connected address using ethers.js.</p>
        <Portfolio provider={provider} address={address} />
      </div>
    </div>
  )
}
