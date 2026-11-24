import { useState, useEffect } from 'react'

const TOKENS = [
  { symbol: 'MARS', name: 'Mars Token', logo: '🔴' },
  { symbol: 'USDC', name: 'USD Coin', logo: '🔵' },
  { symbol: 'tAMM', name: 'Test Ammora', logo: '🟣' },
]

export default function App() {
  const [tab, setTab] = useState('swap')
  const [fromToken, setFromToken] = useState(TOKENS[0])
  const [toToken, setToToken] = useState(TOKENS[1])
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [wallet, setWallet] = useState(null)
  const [status, setStatus] = useState('')
  const [positions, setPositions] = useState([])

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Install MetaMask dulu!')
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setWallet(accounts[0])
    try { await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x16456' }] }) } catch(e) {}
  }

  useEffect(() => {
    if (!amountIn) { setAmountOut(''); return }
    const rate = fromToken.symbol === 'MARS' && toToken.symbol === 'USDC' ? 2 : fromToken.symbol === 'USDC' && toToken.symbol === 'MARS' ? 0.5 : 1
    setAmountOut((parseFloat(amountIn) * rate).toString())
  }, [amountIn, fromToken, toToken])

  const flipTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setAmountIn(amountOut)
  }

  const doSwap = async () => {
    if (!wallet) return connectWallet()
    if (!amountIn) return alert('Isi jumlah dulu!')
    setStatus(`✅ SWAP BERHASIL: ${amountIn} ${fromToken.symbol} → ${amountOut} ${toToken.symbol}`)
    setAmountIn(''); setAmountOut('')
  }

  const addLiquidity = async () => {
    if (!wallet) return connectWallet()
    if (!amountA || !amountB) return alert('Isi kedua jumlah!')
    setPositions([{ id: Date.now(), pair: 'MARS / USDC', a: amountA, b: amountB }, ...positions])
    setStatus(`✅ LIQUIDITY DITAMBAH: ${amountA} MARS + ${amountB} USDC`)
    setAmountA(''); setAmountB('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ background: '#ff007a', color: '#fff', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>♀️</span><b style={{ fontSize: 20 }}>Venus Exchange</b><span style={{ background: '#fff0f6', color: '#ff007a', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 999 }}>DEX</span></div>
        <button onClick={connectWallet} style={{ background: '#ff007a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 999, fontWeight: 700 }}>{wallet ? wallet.slice(0,6)+'...'+wallet.slice(-4) : 'Connect Wallet'}</button>
      </div>
      <div style={{ maxWidth: 480, margin: '30px auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => setTab('swap')} style={{ flex: 1, padding: 12, borderRadius: 999, border: 'none', background: tab==='swap' ? '#ff007a' : '#f0f0f0', color: tab==='swap' ? '#fff' : '#000', fontWeight: 800 }}>Swap</button>
          <button onClick={() => setTab('pool')} style={{ flex: 1, padding: 12, borderRadius: 999, border: 'none', background: tab==='pool' ? '#ff007a' : '#f0f0f0', color: tab==='pool' ? '#fff' : '#000', fontWeight: 800 }}>Pool</button>
        </div>
        <div style={{ border: '1px solid #eee', borderRadius: 24, padding: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
          {tab
