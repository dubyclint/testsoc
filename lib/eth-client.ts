import { ethers } from 'ethers'
import Web3 from 'web3'
import type { ContractInterface } from 'ethers'

type ClientType = 'ethers' | 'web3'

interface EthClientOptions {
  providerUrl: string
  privateKey: string
  contractAddress: string
  abi: ContractInterface
  client: ClientType
}

export class EthClient {
  private ethersProvider?: ethers.providers.JsonRpcProvider
  private web3?: Web3
  private wallet?: ethers.Wallet
  private account?: any
  private contract: any
  private options: EthClientOptions

  constructor(options: EthClientOptions) {
    this.options = options

    if (options.client === 'ethers') {
      this.ethersProvider = new ethers.providers.JsonRpcProvider(options.providerUrl)
      this.wallet = new ethers.Wallet(options.privateKey, this.ethersProvider)
      this.contract = new ethers.Contract(options.contractAddress, options.abi, this.wallet)
    } else {
      this.web3 = new Web3(options.providerUrl)
      this.account = this.web3.eth.accounts.privateKeyToAccount(options.privateKey)
      this.web3.eth.accounts.wallet.add(this.account)
      this.contract = new this.web3.eth.Contract(options.abi, options.contractAddress)
    }
  }

  async read(method: string, ...args: any[]) {
    if (this.options.client === 'ethers') {
      return await this.contract[method](...args)
    } else {
      return await this.contract.methods[method](...args).call()
    }
  }

  async write(method: string, ...args: any[]) {
    if (this.options.client === 'ethers') {
      const tx = await this.contract[method](...args)
      return await tx.wait()
    } else {
      return await this.contract.methods[method](...args).send({ from: this.account.address })
    }
  }

  listen(eventName: string, callback: Function) {
    if (this.options.client === 'ethers') {
      this.contract.on(eventName, (...args) => callback(...args))
    } else {
      this.contract.events[eventName]({}, (err: any, event: any) => {
        if (err) console.error(err)
        else callback(event)
      })
    }
  }
}
