import { useState } from 'react'
import { parseUnits, createWalletClient, custom } from 'viem'
import './index.css'
const RPC = 'https://sepolia-rpc.giwa.io'
const CID = 91342
const TOKENS = [
 { s: 'WETH', a: '0x38A7e25ca0CC945CECDD3B953519A6cD24f9df29' },
 { s: 'MARS', a: '0xB9801dF3532c22F55Cc063198D74b8C64e6C6Cef' },
]
export default function App() {
 const [wallet, setWallet] = useState('')
 const [amt, setAmt] = useState('0.001')
 const [from, setFrom] = useState(0)
 const [to, setTo] = useState(1)
 const [status, setStatus] = useState('Connect wallet GIWA Sepolia')
 const [quote, setQuote] = useState('')
 async function connect() {
  const [acc] = await window.ethereum.request({ method: 'eth_requestAccounts' })
  await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x16456' }] }).catch(async () => {
   await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x16456', chainName: 'GIWA Sepolia', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: [RPC], blockExplorerUrls: ['https://sepolia-explorer.giwa.io'] }] })
  })
  setWallet(acc)
  setStatus('Connected ' + acc)
 }
 async function getQ() {
  if (!wallet) return alert('Connect dulu')
  setStatus('Getting quote...')
  try {
   const { AmmoraRouteClient } = await import('@ammora-protocol/sdk')
   const c = await AmmoraRouteClient.create({ chainId: CID })
   const q = await c.quoteExactIn({ tokenIn: TOKENS[from].a, tokenOut: TOKENS[to].a, amountIn: parseUnits(amt || '0', 18), from: wallet })
   setQuote(JSON.stringify(q).slice(0, 400))
   setStatus('Quote OK')
  } catch (e) { setStatus('Quote gagal: ' + e.message) }
 }
 async function swap() {
  if (!quote) return alert('Get Quote dulu')
  alert('Quote OK, cek console untuk tx. Lanjut ke swap di step berikutnya.')
 }
 return (
  <div style={{ background: '#0a0a0f', color: 'white', minHeight: '100vh', padding: 20, fontFamily: 'sans-serif' }}>
   <div style={{ maxWidth: 520, margin: '0 auto' }}>
    <h2>MARS DEX <span style={{ color: '#ff4d6d' }}>x Ammora</span></h2>
    <button onClick={connect} style={{ background: '#ff4d6d', color: 'white', border: 'none', padding: 12, borderRadius: 20, width: '100%' }}>{wallet ? wallet.slice(0, 10) : 'Connect Wallet'}</button>
    <div style={{ background: '#15151f', borderRadius: 20, padding: 16, marginTop: 16 }}>
     <p>You Pay</p>
     <input value={amt} onChange={e => setAmt(e.target.value)} style={{ background: '#0d0d14', color: 'white', fontSize: 28, width: '100%', padding: 10, border: 'none', borderRadius: 12 }} />
     <select value={from} onChange={e => setFrom(Number(e.target.value))} style={{ marginTop: 10, padding: 10, width: '100%' }}><option value={0}>WETH</option><option value={1}>MARS</option></select>
     <p style={{ textAlign: 'center' }}>↓</p>
     <p>You Receive</p>
     <div style={{ background: '#0d0d14', padding: 10, borderRadius: 12, fontSize: 12, wordBreak: 'break-all' }}>{quote || '-'}</div>
     <select value={to} onChange={e => setTo(Number(e.target.value))} style={{ marginTop: 10, padding: 10, width: '100%' }}><option value={0}>WETH</option><option value={1}>MARS</option></select>
     <button onClick={getQ} style={{ width: '100%', marginTop: 12, padding: 14, background: '#333', color: 'white', border: 'none', borderRadius: 12 }}>GET REAL QUOTE</button>
     <button onClick={swap} style={{ width: '100%', marginTop: 8, padding: 14, background: '#ff4d6d', color: 'white', border: 'none', borderRadius: 12 }}>SWAP ON GIWA</button>
     <p style={{ color: '#f59e0b', fontSize: 12 }}>{status}</p>
    </div>
   </div>
  </div>
 )
}
