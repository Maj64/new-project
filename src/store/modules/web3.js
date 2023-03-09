// api
// get token

const state = {
  account: '',
  balance: '0',
  web3: null,
  netId: 0
}

const mutations = {
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  UPDATE_ACCOUNT: (state, web3Data) => {
    const web3 = web3Data.web3 || state.web3
    const { account, balance } = web3Data
    state.web3 = web3
    state.account = account
    state.balance = balance
  },
  UPDATE_NET_ID: (state, netId) => {
    state.netId = netId
  }
}

const actions = {
  updateAccount({ commit }, web3Data) {
    commit('UPDATE_ACCOUNT', web3Data)
  },
  updateNetId({ commit }, netId) {
    commit('UPDATE_NET_ID', netId)
  },
  async getConnectionInfo({ commit }) {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Make sure you have metamask!')
        return false
      } else {
        console.log('We have the ethereum object')
      }
      await ethereum.on('accountsChanged', function handleAccountsChanged(accounts) {
        // Update the current account when it is changed
        commit('SET_ACCOUNT', accounts[0])
      })
      await ethereum.on('disconnect', function handleDisconnect(error) {
        // Handle the 'disconnect' event when the user's account is locked
        console.error(error)
        commit('SET_ACCOUNT', null)
      })
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length !== 0) {
        commit('SET_ACCOUNT', accounts[0])
        return true
      } else {
        console.log('No authorized account found')
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
