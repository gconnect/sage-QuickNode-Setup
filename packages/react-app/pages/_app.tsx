import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  connectorsForWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import { 
  metaMaskWallet, 
  omniWallet, 
  walletConnectWallet 
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from 'wagmi/providers/public'

// Import known recommended wallets
import { Valora, CeloWallet, CeloDance } from "@celo/rainbowkit-celo/wallets";

// Import CELO chain information
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";

import Layout from "../components/Layout";

const { chains, provider } = configureChains(
  [Alfajores, Celo],
  [jsonRpcProvider({   rpc: () => ({
        http: `https://withered-white-mound.celo-mainnet.discover.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_API_KEY}/`,
      }),
      priority: 0
    }),
    publicProvider({ priority: 1 }),]  
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended with CELO",
    wallets: [
      Valora({ chains }),
      CeloWallet({ chains }),
      CeloDance({ chains }),
      metaMaskWallet({ chains }),
      omniWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App;