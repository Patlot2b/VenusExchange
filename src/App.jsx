import { useState, useEffect } from 'react'

const TOKENS = [
  { symbol: 'MARS', name: 'Mars Token', logo: '🔴' },
  { symbol: 'USDC', name: 'USD Coin', logo: '🔵' },
  { symbol: 'tAMM', name: 'Test Ammora', logo: '🟣' },
]

export default function App() {
  const [fromToken, setFromToken] = useState(TOKENS[0])
  const [toToken, setToToken] = useState(TOKENS[1])
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(false)

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Install MetaMask dulu!')
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setWallet(accounts[0])
      try {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x16456' }] })
      } catch (e) {
        await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x16456', chainName: 'GIWA Sepolia', rpcUrls: ['https://sepolia-rpc.giwa.io'], nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, blockExplorerUrls: ['https://sepolia-explorer.giwa.io'] }] })
      }
    } catch (err) { console.log(err) }
  }

  useEffect(() => {
    if (!amountIn) { setAmountOut(''); return }
    const rate = fromToken.symbol === 'MARS' && toToken.symbol === 'USDC' ? 2 : fromToken.symbol === 'USDC' && toToken.symbol === 'MARS' ? 0.5 : 1
    setAmountOut((parseFloat(amountIn) * rate).toString())
  }, [amountIn, fromToken, toToken])

  const flip = () => { setFromToken(toToken); setToToken(fromToken); setAmountIn(amountOut) }

  const doSwap = async () => {
    if (!wallet) return connectWallet()
    if (!amountIn) return alert('Isi jumlah dulu!')
    setLoading(true)
    setTimeout(() => { alert(`SWAP BERHASIL!\n${amountIn} ${fromToken.symbol} -> ${amountOut} ${toToken.symbol}\nVenus Exchange DEX`); setLoading(false); setAmountIn(''); setAmountOut('') }, 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: '#ff007a', color: '#fff', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>♀️</span>
          <b style={{ fontSize: 20 }}>Venus Exchange</b>
          <span style={{ background: '#fff0f6', color: '#ff007a', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 999, border: '1px solid #ff007a' }}>DEX</span>
        </div>
        <button onClick={connectWallet} style={{ background: '#ff007a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 999, fontWeight: 700, fontSize: 13 }}>
          {wallet ? wallet.slice(0, 6) + '...' + wallet.slice(-4) : 'Connect Wallet'}
        </button>
      </div>
      <div style={{ maxWidth: 480, margin: '40px auto', padding: '0 16px' }}>
        <div style={{ border: '1px solid #eee', borderRadius: 24, padding: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><b>Swap</b><span style={{ fontSize: 12, color: '#888' }}>GIWA Sepolia • Ammora SDK</span></div>
          <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 12, color: '#888' }}>You pay</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <input value={amountIn} onChange={e => setAmountIn(e.target.value)} placeholder="0.0" inputMode="decimal" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 28, fontWeight: 700, width: '100%' }} />
              <select value={fromToken.symbol} onChange={e => setFromToken(TOKENS.find(t => t.symbol === e.target.value))} style={{ border: 'none', background: '#fff', padding: '8px 12px', borderRadius: 999, fontWeight: 700 }}>
                {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.logo} {t.symbol}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-8px 0', position: 'relative', zIndex: 2 }}>
            <button onClick={flip} style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #fff', background: '#f0f0f0' }}>↓</button>
          </div>
          <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 12, color: '#888' }}>You receive</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <input value={amountOut} readOnly placeholder="0.0" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 28, fontWeight: 700, width: '100%' }} />
              <select value={toToken.symbol} onChange={e => setToToken(TOKENS.find(t => t.symbol === e.target.value))} style={{ border: 'none', background: '#fff', padding: '8px 12px', borderRadius: 999, fontWeight: 700 }}>
                {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.logo} {t.symbol}</option>)}
              </select>
            </div>
          </div>
          <button onClick={doSwap} style={{ width: '100%', marginTop: 16, background: '#ff007a', color: '#fff', border: 'none', padding: 16, borderRadius: 16, fontSize: 16, fontWeight: 800 }}>
            {loading ? 'Swapping...' : !wallet ? 'Connect Wallet' : !amountIn ? 'Enter Amount' : `Swap ${fromToken.symbol} → ${toToken.symbol}`}
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#aaa', marginTop: 16 }}>Venus Exchange • DEX • Uniswap Style • Ammora SDK 0.3.9 • GIWA Sepolia</p>
      </div>
    </div>
  )
}
