import { useState } from 'react'
import { createWalletClient, custom, parseUnits } from 'viem'
import './index.css'

const CHAIN_ID = 91342
const RPC = 'https://sepolia-rpc.giwa.io'

const TOKENS = [
  { symbol: 'MARS', name: 'Mars Coin', address: '0xB9801dF3532c22F55Cc063198D74b8C64e6C6Cef', decimals: 18 },
  { symbol: 'WETH', name: 'Wrapped ETH', address: '0x38A7e25ca0CC945CECDD3B953519A6cD24f9df29', decimals: 18 },
]

export default function App() {
  const [wallet, setWallet] = useState(null)
  const [from, setFrom] = useState(TOKENS[1])
  const [to, setTo] = useState(TOKENS[0])
  const [amount, setAmount] = useState('0.001')
  const [quote, setQuote] = useState(null)
  const [status, setStatus] = useState('Connect wallet to GIWA Sepolia (91342)')
  const [loading, setLoading] = useState(false)

  async function connectWallet() {
    if (!window.ethereum) return alert('Install MetaMask!')
    const [acc] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x16456' }] })
    } catch {
      await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x16456', chainName: 'GIWA Sepolia', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: [RPC], blockExplorerUrls: ['https://sepolia-explorer.giwa.io'] }] })
    }
    setWallet(acc)
    setStatus('Wallet connected to GIWA Sepolia ✅')
  }

  async function getQuote() {
    if (!wallet) return alert('Connect Wallet dulu!')
    setLoading(true)
    setStatus('Getting real quote from Ammora...')
    try {
      const { AmmoraRouteClient } = await import('@ammora-protocol/sdk')
      const ammora = await AmmoraRouteClient.create({ chainId: CHAIN_ID })
      const q = await ammora.quoteExactIn({
        tokenIn: from.address,
        tokenOut: to.address,
        amountIn: parseUnits(amount || '0', from.decimals),
        from: wallet,
      })
      setQuote(q)
      setStatus('Real quote from Ammora ✅ : ' + JSON.stringify(q).slice(0, 300))
    } catch (e) {
      console.error(e)
      setStatus('Quote failed: ' + e.message)
      alert('Quote gagal: ' + e.message)
    }
    setLoading(false)
  }

  async function doSwap() {
    if (!quote) return alert('Get Quote dulu!')
    const tx = quote.tx || quote.transaction || quote.calldata
    if (!tx) return alert('Quote ini tidak bawa tx. Cek docs.ammora.org/examples')
    try {
      const walletClient = createWalletClient({ chain: { id: CHAIN_ID, name: 'GIWA Sepolia', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: { default: { http: [RPC] } } }, transport: custom(window.ethereum) })
      const hash = await walletClient.sendTransaction({ account: wallet, to: tx.to, data: tx.data, value: BigInt(tx.value || 0) })
      setStatus('Swap sent! Hash: ' + hash)
      alert('Swap terkirim! Cek: sepolia-explorer.giwa.io/tx/' + hash)
    } catch (e) { alert('Swap gagal: ' + e.message) }
  }

  function flip() { setFrom(to); setTo(from); setQuote(null) }

  return (
    <div style={{ background: '#0a0a0f', color: 'white', minHeight: '100vh', padding: 20, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 520, margin: '0 auto', alignItems: 'center' }}>
        <h2>🚀 MARS<span style={{ color: '#ff4d6d' }}>DEX</span> <span style={{ fontSize: 12, color: '#888' }}>x Ammora • GIWA 91342</span></h2>
        <button onClick={connectWallet} style={{ background: wallet ? '#22c55e' : '#ff4d6d', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 20, fontWeight: 'bold' }}>{wallet ? '✅ ' + wallet.slice(0, 6) + '...' : 'Connect Wallet'}</button>
      </div>

      <div style={{ background: '#15151f', border: '1px solid #2a2a3a', borderRadius: 20, padding: 16, maxWidth: 520, margin: '20px auto' }}>
        <p style={{ color: '#888', fontSize: 12 }}>You Pay</p>
        <div style={{ background: '#0d0d14', borderRadius: 16, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <input value={amount} onChange={e => setAmount(e.target.value)} style={{ background: 'none', border: 'none
