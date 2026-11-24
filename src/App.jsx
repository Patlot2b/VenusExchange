import { useState, useEffect } from 'react'

export default function App() {
  const [tab, setTab] = useState('swap')
  const [from, setFrom] = useState('MARS')
  const [to, setTo] = useState('USDC')
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [status, setStatus] = useState('')

  // Hitung hasil swap
  useEffect(() => {
    if (!amountIn) {
      setAmountOut('')
      return
    }
    let rate = 1
    if (from === 'MARS' && to === 'USDC') rate = 2
    if (from === 'USDC' && to === 'MARS') rate = 0.5
    setAmountOut(String(parseFloat(amountIn) * rate))
  }, [amountIn, from, to])

  // INI TOMBOL BOLAK-BALIKNYA - UDAH BENER
  function flip() {
    setFrom(to)
    setTo(from)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #eee' }}>
        <b style={{ fontSize: 20 }}>♀️ Venus Exchange</b>
        <button style={{ background: '#ff007a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 999, fontWeight: 'bold' }}>Connect Wallet</button>
      </div>

      <div style={{ maxWidth: 480, margin: '30px auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => setTab('swap')} style={{ flex: 1, padding: 12, borderRadius: 999, border: 'none', background: tab === 'swap' ? '#ff007a' : '#eee', color: tab === 'swap' ? '#fff' : '#000', fontWeight: 'bold' }}>Swap</button>
          <button onClick={() => setTab('pool')} style={{ flex: 1, padding: 12, borderRadius: 999, border: 'none', background: tab === 'pool' ? '#ff007a' : '#eee', color: tab === 'pool' ? '#fff' : '#000', fontWeight: 'bold' }}>Pool</button>
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: 24, padding: 16 }}>
          {tab === 'swap' ? (
            <div>
              <b>Swap</b>
              <p style={{ fontSize: 12, color: '#888' }}>1 MARS = 2 USDC</p>

              <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#888' }}>You pay</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={amountIn} onChange={(e) => setAmountIn(e.target.value)} placeholder="0.0" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 26, fontWeight: 'bold', width: '100%' }} />
                  <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ borderRadius: 999, padding: '8px 12px', fontWeight: 'bold' }}>
                    <option>MARS</option>
                    <option>USDC</option>
                    <option>tAMM</option>
                  </select>
                </div>
              </div>

              <div style={{ textAlign: 'center', margin: '8px 0' }}>
                <button onClick={flip} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #ff007a', background: '#fff', fontSize: 20, cursor: 'pointer' }}>↓</button>
              </div>

              <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#888' }}>You receive</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={amountOut} readOnly placeholder="0.0" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 26, fontWeight: 'bold', width: '100%' }} />
                  <select value={to} onChange={(e) => setTo(e.target.value)} style={{ borderRadius: 999, padding: '8px 12px', fontWeight: 'bold' }}>
                    <option>MARS</option>
                    <option>USDC</option>
                    <option>tAMM</option>
                  </select>
                </div>
              </div>

              <button onClick={() => setStatus('✅ SWAP BERHASIL: ' + amountIn + ' ' + from + ' → ' + amountOut + ' ' + to)} style={{ width: '100%', marginTop: 16, background: '#ff007a', color: '#fff', border: 'none', padding: 16, borderRadius: 16, fontWeight: 'bold' }}>Swap</button>
            </div>
          ) : (
            <div>
              <b>Add Liquidity - MARS / USDC</b>
              <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16, marginTop: 12 }}>
                <div style={{ fontSize: 12, color: '#888' }}>MARS</div>
                <input value={amountA} onChange={(e) => setAmountA(e.target.value)} placeholder="0.0" style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 26, fontWeight: 'bold' }} />
              </div>
              <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 16, marginTop: 10 }}>
                <div style={{ fontSize: 12, color: '#888' }}>USDC</div>
                <input value={amountB} onChange={(e) => setAmountB(e.target.value)} placeholder="0.0" style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 26, fontWeight: 'bold' }} />
              </div>
              <button onClick={() => setStatus('✅ LIQUIDITY DITAMBAH: ' + amountA + ' MARS + ' + amountB + ' USDC')} style={{ width: '100%', marginTop: 16, background: '#ff007a', color: '#fff', border: 'none', padding: 16, borderRadius: 16, fontWeight: 'bold' }}>Add Liquidity</button>
            </div>
          )}

          {status && <p style={{ fontSize: 13, background: '#fff0f6', padding: 10, borderRadius: 12, marginTop: 12 }}>{status}</p>}
        </div>
      </div>
    </div>
  )
}
