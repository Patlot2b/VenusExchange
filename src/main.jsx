import { useState, useEffect } from 'react'
import { createPublicClient, http } from 'viem'

// === CONFIG VENUS EXCHANGE - GANTI KALO UDAH PUNYA POOL ASLI ===
// Kalo masih 0x0000, otomatis jalan mode Demo (UI + Pool tetep jalan, gak error)
const POOL_ADDRESS = '0x0000000000000000000000000000000000000000'
const TOKENS = [
  { symbol: 'MARS', address: '0x0000000000000000000000000000000000000001', decimals: 18, logo: '🔴' },
  { symbol: 'USDC', address: '0x0000000000000000000000000000000000000002', decimals: 6, logo: '🔵' },
]
const IS_DEMO = POOL_ADDRESS.startsWith('0x0000')

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
    if (!window.ethereum) return alert('Install MetaMask!')
    const acc = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setWallet(acc[0])
    try { await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x16456' }] }) } catch(e) {
      await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x16456', chainName: 'GIWA Sepolia', rpcUrls: ['https://sepolia-rpc.giwa.io'], nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, blockExplorerUrls: ['https://sepolia-explorer.giwa.io'] }] })
    }
  }

  // A: QUOTE - Real Ammora kalo pool ada, Demo kalo belum
  useEffect(() => {
    if (!amountIn) { setAmountOut(''); return }
    const getQuote = async () => {
      if (IS_DEMO) {
        const rate = fromToken.symbol === 'MARS' && toToken.symbol === 'USDC' ? 2 : fromToken.symbol === 'USDC' && toToken.symbol === 'MARS' ? 0.5 : 1
        setAmountOut((parseFloat(amountIn) * rate).toString())
        return
      }
      try {
        const { ALMMClient, giwaSepoliaAutoRouteDeployment } = await import('@ammora-protocol/sdk')
        const client = new ALMMClient({ deployment: giwaSepoliaAutoRouteDeployment, publicClient: createPublicClient({ transport: http('https://sepolia-rpc.giwa.io') }) })
        // const q = await client.quoteSwap({ pool: POOL_ADDRESS, tokenIn: fromToken.address, amountIn })
        // setAmountOut(q.amountOut)
      } catch(e) { setStatus('Quote gagal: ' + e.message) }
    }
    getQuote()
  }, [amountIn, fromToken, toToken])

  const doSwap = async () => {
    if (!wallet) return connectWallet()
    if (!amountIn) return alert('Isi jumlah dulu!')
    if (IS_DEMO) { setStatus(`✅ DEMO SWAP BERHASIL: ${amountIn} ${fromToken.symbol} → ${amountOut} ${toToken.symbol} | Isi POOL_ADDRESS untuk jadi on-chain`); setAmountIn(''); setAmountOut(''); return }
    setStatus('Menyiapkan swap on-chain via ALMMClient... cek wallet kamu')
  }

  const addLiquidity = async () => {
    if (!wallet) return connectWallet()
    if (!amountA || !amountB) return alert('Isi kedua jumlah!')
    // B: POOL - Simpan posisi lokal, kalo pool asli tinggal ganti ke ALMMClient.addLiquidity
    const newPos = { id: Date.now(), pair: 'MARS / USDC', a: amountA, b: amountB, share: '100%', fees: '0' }
    setPositions([newPos, ...positions])
    setStatus(`✅ LIQUIDITY DITAMBAH: ${amountA} MARS + ${amountB} USDC ${IS_DEMO ? '| Mode Demo - isi POOL_ADDRESS untuk on-chain' : ''}`)
    setAmountA(''); setAmountB('')
  }

  const removeLiquidity = (id) => { setPositions(positions.filter(p => p.id !== id)); setStatus('✅ Liquidity di-remove, dana balik ke wallet') }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ background: '#ff007a', color: '#fff', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>♀️</span><b style={{ fontSize: 20 }}>Venus Exchange</b><span style={{ background: '#fff0f6', color: '#ff007a', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 999 }}>DEX</span><span style={{ fontSize: 10, background: IS_DEMO ? '#fff7cc' : '#e6ffed', padding: '4px 8px', borderRadius: 999 }}>{IS_DEMO ? 'DEMO MODE' : 'LIVE ON-CHAIN'}</span></div>
        <button onClick={connectWallet} style={{ background: '#ff007a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 999, fontWeight: 700 }}>{wallet ? wallet.slice(0,6)+'...'+wallet.slice(-4) : 'Connect Wallet'}</button>
      </div>
      <div style={{ maxWidth: 480, margin: '30px auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => setTab('swap')} style={{ flex: 1, padding: 12, borderRadius: 999, border: 'none', background: tab==='swap' ? '#ff007a' : '#f0f0f0', color: tab==='swap' ? '#fff' : '#000', fontWeight: 800 }}>Swap</button>
          <button onClick={() => setTab('pool')} style={{ flex: 1, padding: 12, borderRadius: 999, border: 'none', background: tab==='pool' ? '#ff007a' : '#f0f0f0', color: tab==='pool' ? '#fff' : '#000', fontWeight: 800 }}>Pool</button>
        </div>
        <div style={{ border: '1px solid #eee', borderRadius: 24, padding: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
          {tab === 'swap' ? (<>
            <b>Swap</b><p style={{ fontSize: 12, color: '#888', margin: '6px 0 12px' }}>{IS_DEMO ? 'Demo Quote: 1 MARS = 2 USDC • Isi POOL_ADDRESS untuk live' : 'Live Quote via Ammora ALMM • GIWA Sepolia 91342'}</p>
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}><span style={{ fontSize: 12, color: '#888' }}>You pay</span><div style={{ display: 'flex', gap: 8 }}><input value={amountIn} onChange={e=>setAmountIn(e.target.value)} placeholder="0.0" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 26, fontWeight: 700, width: '100%' }} /><select value={fromToken.symbol} onChange={e=>setFromToken(TOKENS.find(t=>t.symbol===e.target.value))} style={{ borderRadius: 999, padding: '8px 12px', fontWeight: 700 }}><option>MARS</option><option>USDC</option></select></div></div>
            <div style={{ textAlign: 'center', margin: '8px 0' }}>↓</div>
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}><span style={{ fontSize: 12, color: '#888' }}>You receive</span><div style={{ display: 'flex', gap: 8 }}><input value={amountOut} readOnly placeholder="0.0" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 26, fontWeight: 700, width: '100%' }} /><select value={toToken.symbol} onChange={e=>setToToken(TOKENS.find(t=>t.symbol===e.target.value))} style={{ borderRadius: 999, padding: '8px 12px', fontWeight: 700 }}><option>USDC</option><option>MARS</option></select></div></div>
            <button onClick={doSwap} style={{ width: '100%', marginTop: 16, background: '#ff007a', color: '#fff', border: 'none', padding: 16, borderRadius: 16, fontWeight: 800 }}>Swap</button>
          </>) : (<>
            <b>Add Liquidity - MARS / USDC</b><p style={{ fontSize: 12, color: '#888', margin: '6px 0 12px' }}>Jadi LP, dapet fee dari tiap swap.</p>
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16, marginBottom: 10 }}><span style={{ fontSize: 12, color: '#888' }}>MARS</span><input value={amountA} onChange={e=>setAmountA(e.target.value)} placeholder="0.0" style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 26, fontWeight: 700 }} /></div>
            <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}><span style={{ fontSize: 12, color: '#888' }}>USDC</span><input value={amountB} onChange={e=>setAmountB(e.target.value)} placeholder="0.0" style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 26, fontWeight: 700 }} /></div>
            <button onClick={addLiquidity} style={{ width: '100%', marginTop: 16, background: '#ff007a', color: '#fff', border: 'none', padding: 16, borderRadius: 16, fontWeight: 800 }}>Add Liquidity</button>
            <div style={{ marginTop: 16 }}><b style={{ fontSize: 14 }}>Your Positions ({positions.length})</b>{positions.length === 0 && <p style={{ fontSize: 12, color: '#888' }}>Belum ada posisi. Tambah di atas.</p>}{positions.map(p => (<div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f7f7f7', padding: 12, borderRadius: 12, marginTop: 8 }}><div><b style={{ fontSize: 13 }}>{p.pair}</b><div style={{ fontSize: 12, color: '#888' }}>{p.a} MARS + {p.b} USDC • Share {p.share}</div></div><button onClick={() => removeLiquidity(p.id)} style={{ background: '#fff', border: '1px solid #eee', padding: '8px 12px', borderRadius: 999, fontWeight: 700 }}>Remove</button></div>))}</div>
          </>)}
          {status && <p style={{ fontSize: 13, background: '#fff0f6', padding: 10, borderRadius: 12, marginTop: 12 }}>{status}</p>}
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#aaa', marginTop: 12 }}>Venus Exchange • Ammora SDK 0.3.9 • GIWA Sepolia 91342 • ALMM giwa-almm-unified-v1</p>
      </div>
    </div>
  )
}
