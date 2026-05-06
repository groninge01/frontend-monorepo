import { createConfig } from 'wagmi'
import { chains } from '../../web3/ChainConfig'
import { transports } from '../../web3/transports'

export function createReadonlyWagmiConfig() {
  return createConfig({
    chains,
    connectors: [],
    transports,
  })
}
