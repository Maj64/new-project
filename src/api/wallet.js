const TruffleContract = require('@truffle/contract')
const walletTruffle = require('@/build/contracts/Wallet.json')
import axios from 'axios'
// import { getTokenInfo, getTokenListInfo } from './token'

const Wallet = TruffleContract(walletTruffle)

const service = axios.create({
  baseURL: 'http://222.255.238.183:8001', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

export function getWalletList(account) {
  return service({
    url: '/wallets',
    method: 'get',
    params: { account }
  })
}

export async function get(web3, account, wallet) {
  Wallet.setProvider(web3.currentProvider)
  const multiSig = await Wallet.at(wallet)
  const balance = web3.utils.fromWei(await web3.eth.getBalance(multiSig.address), 'ether')
  const owners = await multiSig.getOwners()
  const name = await multiSig.name()
  const tokens = await multiSig.getTokens()
  const numConfirmationsRequired = await multiSig.numConfirmationsRequired()
  const detailTokens = []
  return {
    name,
    address: multiSig.address,
    balance: Number(balance).toFixed(4),
    owners,
    tokens,
    numConfirmationsRequired: numConfirmationsRequired.toNumber(),
    transactionCount: 1,
    transactions: [],
    detailTokens
  }
}
export async function deposit(web3, account, params) {
  const { wallet, value } = params
  Wallet.setProvider(web3.currentProvider)
  const multiSig = await Wallet.at(wallet)
  await multiSig.sendTransaction({ from: account, value })
}
export async function createWallet(web3, account, params) {
  const { name, numConfirmationsRequired, owners } = params
  Wallet.setProvider(web3.currentProvider)
  const wallet = await Wallet.new(name, numConfirmationsRequired, owners, {
    from: account
  })
  const walletDetail = await get(web3, account, wallet.address)
  return walletDetail
}
// export async function importWallet(web3, account, params) {
//   const { address } = params
//   Wallet.setProvider(web3.currentProvider)
//   const wallet = await Wallet.at(address)
//   return wallet
// }
// export async function addUserToWallet(web3, account, params) {
//   Wallet.setProvider(web3.currentProvider)
//   debugger
//   const wallet = await Wallet.at(params.wallet)
//   // TODO: cần check lại
//   await wallet.addOwner(params.address, {
//     from: account
//   })
//   const owners = await wallet.getOwners()
//   return owners
// }
// export async function getTokensApi(web3, account, params) {
//   Wallet.setProvider(web3.currentProvider)
//   const wallet = await Wallet.at(params.address)
//   const tokens = await wallet.getTokens()
//   let detailTokens = []
//   if (tokens.length != 0) { console.log(tokens) }
//   detailTokens = await getTokenListInfo(web3, account, {
//     wallet: params.address,
//     tokens
//   })
//   return {
//     tokens,
//     detailTokens
//   }
// }
// export async function getTransactionsApi(web3, account, params) {
//   Wallet.setProvider(web3.currentProvider)
//   const wallet = await Wallet.at(params.address)
//   const transactionCount = await wallet.getTransactionCount()
//   const count = transactionCount.toNumber()
//   const transactions = []
//   for (let i = 1; i <= 10; i++) {
//     const txIndex = count - i
//     if (txIndex < 0) {
//       break
//     }
//     const tx = await wallet.getTransaction(txIndex)
//     const isConfirmed = await wallet.isConfirmed(txIndex, account)
//     transactions.push({
//       txIndex,
//       destination: tx.destination,
//       value: tx.value,
//       data: tx.data,
//       token: tx.token,
//       executed: tx.executed,
//       numConfirmations: tx.numConfirmations.toNumber(),
//       isConfirmedByCurrentAccount: isConfirmed
//     })
//   }
//   return {
//     transactions
//   }
// }
// export async function getOwnersApi(web3, account, params) {
//   Wallet.setProvider(web3.currentProvider)
//   const wallet = await Wallet.at(params.address)
//   const owners = await wallet.getOwners()
//   const reqCount = await wallet.getRequestOwnerCount()
//   const count = reqCount.toNumber()
//   const requests = []
//   if (count !== 0) {
//     for (let i = 1; i <= 10; i++) {
//       const reqIndex = count - i
//       if (reqIndex < 0) {
//         break
//       }
//       const req = await wallet.getRequestOwner(reqIndex)
//       const isConfirmed = await wallet.reqConfirmed(reqIndex, account)
//       console.log(req.numConfirmations)
//       requests.push({
//         reqIndex,
//         owner: req.owner,
//         numberConfirmations: req.numConfirmations.toNumber(),
//         data: req.data,
//         executed: req.executed,
//         addOwner: req.addOwner,
//         isConfirmedByCurrentAccount: isConfirmed
//       })
//     }
//   }
//   return {
//     owners,
//     requests
//   }
// }
// export async function submitRequestOwner(web3, account, params) {
//   const { address, owner, data, addOwner } = params
//   Wallet.setProvider(web3.currentProvider)
//   const wallet = await Wallet.at(address)
//   await wallet.submitRequestOwner(owner, new TextEncoder().encode(data), addOwner, {
//     from: account
//   })
// }
// export async function confirmRequestOwner(web3, account, params) {
//   const { address, reqIndex } = params
//   Wallet.setProvider(web3.currentProvider)
//   const wallet = await Wallet.at(address)
//   await wallet.confirmRequestOwner(reqIndex, {
//     from: account
//   })
// }
// export async function executeRequestOwner(web3, account, params) {
//   const { address, reqIndex } = params
//   Wallet.setProvider(web3.currentProvider)
//   const wallet = await Wallet.at(address)
//   await wallet.executeRequestOwner(reqIndex, {
//     from: account
//   })
// }
// export async function getWalletAtAddress(web3, account, params) {
//   Wallet.setProvider(web3.currentProvider)
//   const multiSig = await Wallet.at(params.address)
//   return multiSig
// }
export async function submitTransaction(web3, account, params) {
  const { destination, value, data, token, wallet } = params
  Wallet.setProvider(web3.currentProvider)
  const multiSig = await Wallet.at(wallet)
  await multiSig.submitTransaction(destination, value, new TextEncoder().encode(data), token, {
    from: account
  })
}
// export async function confirmTransaction(web3, account, params) {
//   const { txIndex, wallet } = params
//   if (web3) {
//     Wallet.setProvider(web3.currentProvider)
//     const multiSig = await Wallet.at(wallet)
//     await multiSig.confirmTransaction(txIndex, {
//       from: account
//     })
//   }
// }
// export async function revokeConfirmation(web3, account, params) {
//   const { txIndex, wallet } = params
//   Wallet.setProvider(web3.currentProvider)
//   const multiSig = await Wallet.at(wallet)
//   await multiSig.revokeConfirmation(txIndex, {
//     from: account
//   })
// }
// export async function executeTransaction(web3, account, params) {
//   /*
//       Exercise
//       Write code that will call executeTransaction on MultiSigWallet contract
//       */
//   const { txIndex, wallet } = params
//   Wallet.setProvider(web3.currentProvider)
//   const multiSig = await Wallet.at(wallet)
//   await multiSig.executeTransaction(txIndex, {
//     from: account
//   })
// }
// export async function createToken(web3, account, params) {
//   const { name, symbol, decimals, total, wallet } = params
//   Wallet.setProvider(web3.currentProvider)
//   const multiSig = await Wallet.at(wallet)
//   const tokenAddress = await multiSig.createToken(name, symbol, decimals, total, {
//     from: account
//   })
//   const tokens = await multiSig.getTokens()
//   const tokenInfo = await getTokenInfo(web3, tokens[tokens.length - 1], wallet)
//   return tokenInfo
// }
// export async function getBalanceOfToken(web3, account, params) {
//   const { addrWallet, addressToken, wallet } = params
//   Wallet.setProvider(web3.currentProvider)
//   const multiSig = await Wallet.deployed()
//   await multiSig.getBalanceOfToken(addressToken, addrWallet, {
//     from: account
//   })
// }
// export function subscribe(web3, address, callback) {
//   const multiSig = new web3.eth.Contract(Wallet.abi, address)
//   const res = multiSig.events.allEvents((error, log) => {
//     if (error) {
//       callback(error, null)
//     } else if (log) {
//       callback(null, log)
//     }
//   })
//   return () => res.unsubscribe()
// }
