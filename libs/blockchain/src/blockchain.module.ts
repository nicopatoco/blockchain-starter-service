import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import blockchainConfig from './config/blockchain.config'
import { MulticallService } from './multicall/multicall.service'
import { ProviderService } from './provider.service'

@Module({
  imports: [ConfigModule.forRoot({ load: [blockchainConfig] })],
  providers: [ProviderService, MulticallService],
  exports: [ProviderService, MulticallService],
})
export class BlockchainModule {}
