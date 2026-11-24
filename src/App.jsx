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
          {tab === 'swap' ? (<>
            <b>Swap</b><p style={{ fontSize: 12, color: '#888', margin: '6px 0 12px' }}>1 MARS = 2 USDC • GIWA Sepolia</p>
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}><span style={{ fontSize: 12, color: '#888' }}>You pay</span><div style={{ display: 'flex', gap: 8 }}><input value={amountIn} onChange={e=>setAmountIn(e.target.value)} placeholder="0.0" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 26, fontWeight: 700, width: '100%' }} /><select value={fromToken.symbol} onChange={e=>setFromToken(TOKENS.find(t=>t.symbol===e.target.value))} style={{ borderRadius: 999, padding: '8px 12px', fontWeight: 700 }}>{TOKENS.map(t=><option key={t.symbol}>{t.symbol}</option>)}</select></div></div>
            <div style={{ textAlign: 'center', margin: '8px 0' }}>↓</div>
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}><span style={{ fontSize: 12, color: '#888' }}>You receive</span><div style={{ display: 'flex', gap: 8 }}><input value={amountOut} readOnly placeholder="0.0" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 26, fontWeight: 700, width: '100%' }} /><select value={toToken.symbol} onChange={e=>setToToken(TOKENS.find(t=>t.symbol===e.target.value))} style={{ borderRadius: 999, padding: '8px 12px', fontWeight: 700 }}>{TOKENS.map(t=><option key={t.symbol}>{t.symbol}</option>)}</select></div></div>
            <button onClick={doSwap} style={{ width: '100%', marginTop: 16, background: '#ff007a', color: '#fff', border: 'none', padding: 16, borderRadius: 16, fontWeight: 800 }}>Swap</button>
          </>) : (<>
            <b>Add Liquidity - MARS / USDC</b><p style={{ fontSize: 12, color: '#888', margin: '6px 0 12px' }}>Jadi LP, dapet fee dari tiap swap.</p>
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16, marginBottom: 10 }}><span style={{ fontSize: 12, color: '#888' }}>MARS</span><input value={amountA} onChange={e=>setAmountA(e.target.value)} placeholder="0.0" style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 26, fontWeight: 700 }} /></div>
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}><span style={{ fontSize: 12, color: '#888' }}>USDC</span><input value={amountB} onChange={e=>setAmountB(e.target.value)} placeholder="0.0" style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 26, fontWeight: 700 }} /></div>
            <button onClick={addLiquidity} style={{ width: '100%', marginTop: 16, background: '#ff007a', color: '#fff', border: 'none', padding: 16, borderRadius: 16, fontWeight: 800 }}>Add Liquidity</button>
            <div style={{ marginTop: 16 }}><b style={{ fontSize: 14 }}>Your Positions ({positions.length})</b>{positions.length === 0 && <p style={{ fontSize: 12, color: '#888' }}>Belum ada posisi. Tambah di atas.</p>}{positions.map(p => (<div key={p.id} style={{ background: '#f7f7f7', padding: 12, borderRadius: 12, marginTop: 8 }}><b style={{ fontSize: 13 }}>{p.pair}</b><div style={{ fontSize: 12, color: '#888' }}>{p.a} MARS + {p.b} USDC</div></div>))}</div>
          </>)}
          {status && <p style={{ fontSize: 13, background: '#fff0f6', padding: 10, borderRadius: 12, marginTop: 12 }}>{status}</p>}
        </div>
      </div>
    </div>
  )
}
