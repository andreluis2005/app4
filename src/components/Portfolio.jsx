import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers'

// Minimal list of tokens to check on Base network (example placeholder).
// Replace addresses with actual token contract addresses on Base.
const TOKEN_LIST = [
  // Example format:
  // { symbol: 'USDC', address: '0x....', decimals: 6 },
]

export default function Portfolio({ provider, address }){
  const [ethBalance, setEthBalance] = useState(null)
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(!provider || !address) return
    let mounted = true
    setLoading(true)
    ;(async ()=>{
      try{
        const bal = await provider.getBalance(address)
        if(!mounted) return
        setEthBalance(bal)

        // If you want ERC-20 balances, implement minimal ABI and call contract.balanceOf(address)
        // For now we show placeholders; update TOKEN_LIST above and uncomment logic below to fetch.
        const tokenBalances = await Promise.all(TOKEN_LIST.map(async t=>{
          try{
            // Minimal ERC20 ABI for balanceOf and decimals
            const abi = ["function balanceOf(address) view returns (uint256)","function decimals() view returns (uint8)","function symbol() view returns (string)"]
            const contract = new (await import('ethers')).Contract(t.address, abi, provider)
            const raw = await contract.balanceOf(address)
            const decimals = t.decimals ?? await contract.decimals()
            const symbol = t.symbol ?? await contract.symbol()
            return { ...t, symbol, balance: formatUnits(raw, decimals) }
          }catch(e){
            return { ...t, balance: "error" }
          }
        }))
        if(!mounted) return
        setTokens(tokenBalances)
      }catch(e){
        console.error(e)
      }finally{ if(mounted) setLoading(false) }
    })()
    return ()=> mounted=false
  },[provider,address])

  return (
    <div>
      <h4>Portfolio</h4>
      {!provider && <div className="small">Connect wallet to see balances</div>}
      {loading && <div className="small">Loading...</div>}
      {ethBalance && (
        <div className="token">
          <div><strong>ETH (Base)</strong><div className="small">Native balance</div></div>
          <div>{formatUnits(ethBalance,18)} ETH</div>
        </div>
      )}
      <div style={{marginTop:12}}>
        <strong>Tokens</strong>
        {tokens.length===0 && <div className="small">No tokens tracked. Edit <code>TOKEN_LIST</code> in <code>src/components/Portfolio.jsx</code></div>}
        {tokens.map(t=>(
          <div key={t.address} className="token">
            <div>{t.symbol}<div className="small">{t.address}</div></div>
            <div>{t.balance}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
