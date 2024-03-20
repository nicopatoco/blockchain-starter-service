import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BlockchainModule } from '@app/blockchain'

@Module({
  imports: [BlockchainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
