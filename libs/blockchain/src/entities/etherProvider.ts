import { providers, Wallet } from 'ethers'

export type EtherProvider = Wallet | providers.JsonRpcProvider
