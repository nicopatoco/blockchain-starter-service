import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ChainId, MULTICALL2_ADDRESS } from '@yieldwolf/sdk'
import { ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import _ from 'lodash'
import { EtherProvider } from '../entities/etherProvider'
import { ProviderService } from '../provider.service'
import MULTICALL_ABI from './multicall.abi.json'

export interface CallSingleContract {
  address: string
  name: string
  params?: any[]
}

export interface CallManyContracts {
  abi: any[]
  address: string
  name: string
  params?: any[]
}

export interface CallWithResolve<T> {
  calls: CallManyContracts[]
  resolve: (res: any) => T
}

type MulticallTryAggregateRes = Array<{
  success: boolean
  returnData: string
}>

interface MulticallOptions {
  requireSuccess?: boolean
}

@Injectable()
export class MulticallService {
  constructor(
    private configService: ConfigService,
    private providerService: ProviderService,
  ) {}

  async callOneContract(
    chainId: ChainId,
    abi: any[],
    calls: CallSingleContract[],
    { requireSuccess = true }: MulticallOptions = {},
  ) {
    const chunkSize = this.configService.get('networks')[chainId]?.maxMulticallSize
    const callChuncks = chunkSize ? _.chunk(calls, chunkSize) : [calls]
    const res = []
    for (const chunk of callChuncks) {
      res.push(...(await this.executeMulticallOneContract(chainId, abi, chunk, { requireSuccess })))
    }
    return res
  }

  private async executeMulticallOneContract(
    chainId: ChainId,
    abi: any[],
    calls: CallSingleContract[],
    { requireSuccess = true }: MulticallOptions = {},
  ) {
    const multicall = this.getMulticallContract(chainId)
    const itf = new Interface(abi)
    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
    const results: MulticallTryAggregateRes = await multicall.callStatic.tryAggregate(requireSuccess, calldata)
    return results.map(({ success, returnData }, i) => {
      try {
        return success ? itf.decodeFunctionResult(calls[i].name, returnData) : null
      } catch (e) {
        if (requireSuccess) {
          throw e
        }
        return null
      }
    })
  }

  async callManyContracts(
    chainId: ChainId,
    calls: CallManyContracts[],
    { requireSuccess = true }: MulticallOptions = {},
  ) {
    const chunkSize = this.configService.get('networks')[chainId]?.maxMulticallSize
    const callChuncks = chunkSize ? _.chunk(calls, chunkSize) : [calls]
    const res = []
    for (const chunk of callChuncks) {
      res.push(...(await this.executeMulticallManyContracts(chainId, chunk, { requireSuccess })))
    }
    return res
  }

  private async executeMulticallManyContracts(
    chainId: ChainId,
    calls: CallManyContracts[],
    { requireSuccess = true }: MulticallOptions = {},
  ) {
    const multicall = this.getMulticallContract(chainId)
    const callsWithInterface = calls.map((call) => ({ ...call, itf: new Interface(call.abi) }))
    const calldata = callsWithInterface.map((call) => [
      call.address.toLowerCase(),
      call.itf.encodeFunctionData(call.name, call.params),
    ])
    const results: MulticallTryAggregateRes = await multicall.callStatic.tryAggregate(requireSuccess, calldata)
    return results.map(({ success, returnData }, i) => {
      try {
        return success ? callsWithInterface[i].itf.decodeFunctionResult(callsWithInterface[i].name, returnData) : null
      } catch (e) {
        if (requireSuccess) {
          throw e
        }
        return null
      }
    })
  }

  async callAndResolve<T>(
    chainId: ChainId,
    callsWithResolve: CallWithResolve<T>[],
    options: MulticallOptions = {},
  ): Promise<T[]> {
    const calls: CallManyContracts[] = callsWithResolve.reduce((prev, curr) => {
      return [...prev, ...curr.calls]
    }, [])
    const responses = await this.callManyContracts(chainId, calls, options)
    const data = callsWithResolve.reduce(
      (prev, { calls, resolve }) => {
        const res = prev.responses.slice(0, calls.length)
        return {
          responses: prev.responses.slice(calls.length),
          resolved: [...prev.resolved, resolve(res)],
        }
      },
      { responses, resolved: [] },
    )
    return data.resolved
  }

  private getMulticallContract(
    chainId: ChainId,
    provider: EtherProvider = this.providerService.getReadOnlyProvider(chainId),
  ) {
    return new ethers.Contract(MULTICALL2_ADDRESS[chainId], MULTICALL_ABI, provider)
  }
}
