import { ChainId } from '@yieldwolf/sdk'
import { toWei } from 'libs/blockchain/utils/units'

export interface NamedAccount {
  devAddress: string
}

export interface NetworkConfig {
  key: string
  url: string
  gasPrice?: number // use fixed gas price
  gasPriceMultiplier?: number
  minGasPrice?: number
  maxMulticallSize?: number
  blockTime: number // used when subgraph data is not available
  maxFetchEventsPerCall?: number
}

const blockchainConfig: () => { accounts: NamedAccount; networks: { [key: number]: NetworkConfig } } = () => ({
  accounts: {
    devAddress: process.env.PRIVATE_KEY_DEV,
  },
  networks: {
    [ChainId.ARBITRUM]: {
      key: 'arbitrum',
      url: process.env.ARBITRUM_RPC_URL,
      minRunnerBalance: toWei('0.1', 'wei'),
      blockTime: 13,
    },
    [ChainId.AVALANCHE]: {
      key: 'avalanche',
      url: process.env.AVALANCHE_RPC_URL,
      minGasPrice: 25000000000, // 25 gwei
      gasPriceMultiplier: 0.75,
      minRunnerBalance: toWei('1', 'wei'),
      blockTime: 2,
      maxFetchEventsPerCall: 1000,
    },
    [ChainId.BSC]: {
      key: 'bsc',
      url: process.env.BSC_RPC_URL,
      minGasPrice: 5000000000, // 5 gwei
      minRunnerBalance: toWei('2', 'wei'),
      blockTime: 3,
      maxFetchEventsPerCall: 2000,
    },
    [ChainId.CELO]: {
      key: 'celo',
      url: process.env.CELO_RPC_URL,
      minGasPrice: 500000000, // 0.5 gwei
      minRunnerBalance: toWei('10', 'wei'),
      blockTime: 5,
      maxFetchEventsPerCall: 100000,
    },
    [ChainId.CRONOS]: {
      key: 'cronos',
      url: process.env.CRONOS_RPC_URL,
      minGasPrice: 5000000000000, // 5000 gwei
      minRunnerBalance: toWei('100', 'wei'),
      blockTime: 5,
      maxFetchEventsPerCall: 1000,
    },
    [ChainId.FANTOM]: {
      key: 'fantom',
      url: process.env.FANTOM_RPC_URL,
      minGasPrice: 2000000000, // 2 gwei
      gasPriceMultiplier: 0.9,
      minRunnerBalance: toWei('200', 'wei'),
      blockTime: 0.78,
      maxFetchEventsPerCall: 500,
    },
    [ChainId.GNOSIS]: {
      key: 'gnosis',
      url: process.env.GNOSIS_RPC_URL,
      minRunnerBalance: toWei('200', 'wei'),
      blockTime: 5,
    },
    [ChainId.HARMONY]: {
      key: 'harmony',
      url: process.env.HARMONY_RPC_URL,
      minGasPrice: 2000000000, // 2 gwei
      minRunnerBalance: toWei('500', 'wei'),
      blockTime: 2.2,
      maxFetchEventsPerCall: 1024,
    },
    [ChainId.MATIC]: {
      key: 'polygon',
      url: process.env.POLYGON_RPC_URL,
      minGasPrice: 30000000000, // 30 gwei
      minRunnerBalance: toWei('50', 'wei'),
      blockTime: 2,
      maxMulticallSize: 1000,
      maxFetchEventsPerCall: 2500,
    },
    [ChainId.METIS]: {
      key: 'metis',
      url: process.env.METIS_RPC_URL,
      minGasPrice: 8000000000, // 8 gwei
      minRunnerBalance: toWei('1', 'wei'),
      blockTime: 5.5,
      maxFetchEventsPerCall: 100000,
    },
    [ChainId.OPTIMISM]: {
      key: 'optimism',
      url: process.env.OPTIMISM_RPC_URL,
      minRunnerBalance: toWei('0.1', 'wei'),
      blockTime: 10,
    },
    [ChainId.DOGE]: {
      key: 'doge',
      url: process.env.DOGE_RPC_URL,
      minRunnerBalance: toWei('500', 'wei'),
      blockTime: 2,
    },
    [ChainId.CORE]: {
      key: 'core',
      url: process.env.CORE_RPC_URL,
      minRunnerBalance: toWei('50', 'wei'),
      blockTime: 2,
    },
  },
})

export default blockchainConfig
