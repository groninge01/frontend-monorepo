import { GqlChain } from '@repo/lib/shared/services/api/generated/graphql'

export const chainGradient: Partial<Record<GqlChain, { from: string; to: string }>> = {
  [GqlChain.Arbitrum]: {
    from: '#6C80A7',
    to: '#2D374B',
  },
  [GqlChain.Mainnet]: {
    from: '#F7F7F7',
    to: '#A4C6EE',
  },
  [GqlChain.Base]: {
    from: '#99B9FF',
    to: '#0252FF',
  },
  [GqlChain.Optimism]: {
    from: '#FF9EA9',
    to: '#FF0420',
  },
  [GqlChain.Polygon]: {
    from: '#DECEF8',
    to: '#8247E5',
  },
  [GqlChain.Zkevm]: {
    from: '#CD6BE1',
    to: '#7C40E4',
  },
  [GqlChain.Gnosis]: {
    from: '#07DEA7',
    to: '#04795B',
  },
  [GqlChain.Avalanche]: {
    from: '#F39B9B',
    to: '#DA1A1C',
  },
  [GqlChain.Fantom]: {
    from: '#7D84FF',
    to: '#5468FF',
  },
  [GqlChain.Fraxtal]: {
    from: '#E0E7FF',
    to: '#8C9EFF',
  },
  [GqlChain.Mode]: {
    from: '#FFD77D',
    to: '#FFB74D',
  },
  [GqlChain.Sepolia]: {
    from: '#D1B3FF',
    to: '#A384FF',
  },
  [GqlChain.Sonic]: {
    from: '#D1B3FF',
    to: '#A384FF',
  },
  [GqlChain.Hyperevm]: {
    from: '#50D2C1',
    to: '#072723',
  },
}
