import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ChainId } from '@yieldwolf/sdk'
import { ethers } from 'ethers'
import { NamedAccount } from './config/blockchain.config'

@Injectable()
export class ProviderService {
  constructor(private configService: ConfigService) {}

  getReadOnlyProvider(chainId: ChainId) {
    const networks = this.configService.get('networks')
    if (!networks[chainId]?.url) {
      throw new Error(`Configuration for network ${chainId} not found`)
    }
    return new ethers.providers.JsonRpcProvider(networks[chainId].url)
  }

  getSignedProvider(chainId: ChainId, account: keyof NamedAccount) {
    const provider = this.getReadOnlyProvider(chainId)
    const pk = this.configService.get(`accounts.${account}`)
    return new ethers.Wallet(pk, provider)
  }

  signMessage(chainId: ChainId, account: keyof NamedAccount, message: string) {
    const provider = this.getSignedProvider(chainId, account)
    return provider.signMessage(ethers.utils.arrayify(message))
  }

  getAddress(chainId: ChainId, account: keyof NamedAccount) {
    const provider = this.getSignedProvider(chainId, account)
    return provider.address
  }
}
