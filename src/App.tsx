import './App.css'
import { TokenLaunchpad } from './components/TokenLaunchpad'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useMemo } from 'react'
import { useState } from 'react';


function App() {

  return (
    <ConnectionProvider endpoint={'https://api.devnet.solana.com'}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div style={{
            display:'flex',
            justifyContent:'space-between',
            padding:20
          }}>
          <WalletMultiButton/>
            <WalletDisconnectButton/>
          </div>
              <TokenLaunchpad/>
            
          
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>

  )
}




export default App
