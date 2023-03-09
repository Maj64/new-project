<template>
  <div class="app-container">
    <div class="feature-container">
      <div class="feature-header">Wallet</div>
      <div class="feature-item">
        <button class="btn btn-add" @click="handleAdd">Add</button>
      </div>
    </div>
    <Table
      :columns="columns"
      :data-source="wallets"
      :class-name="className"
      @row-click="openWalletDetail"
    >
      <template v-slot:required="{rowData}">
        <div class="action-item">
          <div class="row-text">{{ rowData.numConfirmationsRequired }}</div>
          <button class="btn btn-edit" @click.stop="handleEdit(rowData)">Edit</button></div>
      </template>
      <template v-slot:action="{rowData}">
        <div class="action">
          <div class="action-item"><button class="btn-size deposit-btn btn-normal" @click.stop="handleDeposit(rowData)">Deposit</button></div>
          <div class="action-item"><button class="btn withdraw-btn" @click.stop="handleWithdraw(rowData)">Withdraw</button></div>
        </div>
      </template>
    </Table>
    <Form :dialog-data="dialogData" :data-form="dataForm" :form-list="formData">
      <template v-slot:owners>
        <div class="owner-header">
          <h3>Owners</h3>
          <div class="action-item"><button class="btn" @click="handleAddOwner">Add</button></div>
        </div>
        <Table :class-name="classNameForm" :columns="columnOwner" :data-source="wallet.owners">
          <template v-slot:action="{rowData}">
            <div class="action-item"><button class="btn btn-danger" @click="handleRemoveOwner(rowData)">Remove</button></div>
          </template>
        </Table>
      </template>
      <template v-slot:footerDialog>
        <el-button type="info" class="btn-normal btn-cancel" plain @click="handleCancel">Cancel</el-button>
        <div v-if="dialogData.action">
          <el-button type="success" class="btn" @click="handleSubmit">Send Transaction</el-button>
        </div>
        <div v-else>
          <el-button type="success" class="btn" @click="handleSubmit">Submit</el-button>
        </div>
      </template>
    </Form>
  </div>
</template>

<script>
import Table from '@/components/MyTableComponent/Table.vue'
import Form from '@/components/MyDialogComponent/Form.vue'
import Web3 from 'web3'
import { mapGetters } from 'vuex'
import {
  get,
  getWalletList,
  createWallet,
  deposit,
  submitTransaction
} from '@/api/wallet'

export default {
  name: 'Wallet',
  components: {
    Table,
    Form
  },
  data() {
    return {
      className: 'table-container-height',
      classNameForm: 'table-container',
      dialogData: {
        title: '',
        dialogVisible: false,
        template: 'footerDialog',
        type: null,
        action: null
      },
      dataForm: {},
      formData: [],
      formList: [
        { type: 'text', label: 'Name', field: 'name' },
        { type: 'text', label: 'Address', field: 'address' },
        { type: 'number', label: 'Balance', field: 'balance' },
        { type: 'number', label: 'Required Confirmations', field: 'numConfirmationsRequired' },
        { template: 'owners' }
      ],
      columns: [
        { name: 'Name', field: 'name' },
        { name: 'Address', field: 'address', unShorten: true },
        { name: 'Balance', field: 'balance' },
        { name: 'Required Confirmations', field: 'numConfirmationsRequired', template: 'required' },
        { name: 'Action', template: 'action' }
      ],
      columnOwner: [
        { name: 'Name', field: 'name', input: 'input' },
        { name: 'Address', field: 'address', input: 'input' },
        { name: 'Action', template: 'action' }
      ],
      wallets: [
        {
          name: 'DKT',
          address: '0x2b68A0e874d502DcBf5035338B2d1196f47Fc664',
          balance: '100',
          numConfirmationsRequired: 2
        }
      ],
      wallet: {
        name: '',
        address: '',
        balance: '',
        numConfirmationsRequired: '',
        owners: [{
          name: '',
          address: ''
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'provider',
      'account',
      'web3'
    ])
  },
  mounted() {
    this.$store.dispatch('app/displaySidebar', false)
    this.getWalletList()
  },
  methods: {
    async openWalletDetail(wallet) {
      try {
        const walletDetail = await get(this.web3, this.account, wallet)
        console.log(walletDetail)
        // if (walletDetail) {
        //   this.$store.dispatch('multiSigWallet/set', walletDetail)
        //   this.$store.dispatch('app/displaySidebar', true)
        //   this.$store.dispatch('app/setWalletID', wallet?.address)
        //   this.$router.push(`/${wallet?.address}/home`)
        // }
      } catch (error) {
        console.log(error)
      }
    },
    async getWalletList() {
      try {
        if (!this.account) {
          return false
        }
        console.log(this.account)
        const walletList = await getWalletList(this.account)
        console.log(walletList)
      } catch (error) {
        console.log(error)
      }
    },
    handleRowClick(rowData) {
      this.$router.push(`/${rowData?.address}/home`)
      this.$store.dispatch('app/displaySidebar', true)
      this.$store.dispatch('app/setWalletID', rowData?.address)
    },
    resetData() {
      this.dialogData = {
        title: '',
        dialogVisible: false,
        template: 'footerDialog',
        type: null
      }
      this.dataForm = {}
      this.formData = {}
    },
    handleAdd() {
      this.dialogData = {
        title: 'Add',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'add'
      }
      this.dataForm = {
        ...this.wallet,
        owners: [{
          name: '',
          address: ''
        }] }
      this.formData = [...this.formList]
    },
    handleCancel() {
      this.resetData()
    },
    async handleCreateWallet() {
      try {
        const ownerAddressList = this.wallet.owners.map((i) => i.address)
        if (this.web3) {
          const wallet = await createWallet(this.web3, this.account, {
            name: this.wallet.name,
            numConfirmationsRequired: this.wallet.numConfirmationsRequired,
            owners: ownerAddressList
          })
          this.$store.dispatch('wallet/addWallet', {
            name: wallet.name,
            address: wallet.address,
            balance: Number(wallet.balance),
            numConfirmationsRequired: wallet.numConfirmationsRequired
          })
          this.$message({
            message: 'Create wallet successfully',
            type: 'success'
          })
        } else {
          this.$message({
            message: 'You must unlock Metamask',
            type: 'warning'
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleSubmit() {
      switch (this.dialogData.type) {
        case 'edit': {
          this.wallets = this.wallets.map(wallet => wallet.id !== this.dataForm.id ? wallet : this.dataForm)
          break
        }
        case 'add':
          this.wallets.push(this.dataForm)
          break

        default:
          break
      }
      this.resetData()
    },
    handleEdit(rowData) {
      this.dialogData = {
        ...this.dialogData,
        title: 'Edit Number Required Confirmations',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'edit'
      }
      this.dataForm = {
        ...rowData,
        numConfirmationsRequired: rowData.numConfirmationsRequired
      }
      this.formData = [{
        type: 'number',
        label: 'Required Confirmations',
        field: 'numConfirmationsRequired'
      }]
    },
    async handleDeposit(wallet) {
      if (!this.web3) {
        this.$message({
          message: 'You must unlock Metamask',
          type: 'warning'
        })
        return
      }

      // fake data
      let depositValue = '29374'

      // depositValue in deposit input
      const value = Web3.utils.toBN(depositValue)
      const zero = Web3.utils.toBN(0)

      if (value.gt(zero)) {
        await deposit(this.web3, this.account, { value, wallet })
        // set depositValue
        depositValue = '0'
        const valueEther = this.web3.utils.fromWei(depositValue.toString(), 'ether')
        this.$store.dispatch('web3/updateBalance', {
          address: wallet,
          balance: Number(Number(valueEther).toFixed(4))
        })
        const balance = this.web3.utils.fromWei(
          await this.web3.eth.getBalance(this.account),
          'ether'
        )
        const newBalance = Number(balance).toFixed(4)
        this.$store.dispatch('web3/updateAccount', {
          account: this.account,
          balance: newBalance,
          web3: this.web3
        })
        this.$message({
          message: 'Deposit successfully',
          type: 'success'
        })
      }

      // need close form
      /*
      this.dialogData = {
        ...this.dialogData,
        title: 'Deposit',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'deposit',
        action: 'deposit'
      }
      this.formData = [
        {
          type: 'number',
          label: 'Amount(ETH)',
          field: 'balance'
        }
      ]
      */
    },
    async handleWithdraw(wallet) {
      if (!this.web3) {
        this.$message({
          message: 'You must unlock Metamask',
          type: 'warning'
        })
        return
      }

      // fake data withDrawValue
      const withDrawValue = '.12386'
      const address = 'address'

      const value = Web3.utils.toBN(withDrawValue)
      const zero = Web3.utils.toBN(0)

      if (value.gt(zero)) {
        try {
          if (!this.web3) {
            throw new Error('No web3')
          }
          await submitTransaction(this.web3, this.account, {
            value: withDrawValue.toString(),
            destination: address,
            data: 'dab',
            token: '0x0000000000000000000000000000000000000000',
            wallet
          })
          this.$message({
            message: 'Withdraw ETH successfully',
            type: 'success'
          })
          // close form, reset value
        } catch (error) {
          console.log(error)
        }
      }

      /*
      this.dialogData = {
        ...this.dialogData,
        title: 'Withdraw',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'withdraw',
        action: 'withdraw'
      }
      this.formData = [
        {
          type: 'number',
          label: 'Amount(ETH)',
          field: 'balance'
        },
        {
          type: 'text',
          label: 'Address',
          field: 'address'
        }
      ]
      */
    },
    handleAddOwner() {
      this.wallet.owners.push({
        id: '',
        name: '',
        address: ''
      })
    },
    handleRemoveOwner(rowData) {
      this.wallet.owners.splice(rowData.RowIndex, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-text: black;
$--color-border-light: #303033;
$--space-3: 24px;
.app-container {

  .owner-header {
    display: flex;
    justify-content: space-between;
  }

  .modal-container {
    .modal {
      background-color: rgba(99, 102, 105, 0.75);
      .form-container {
        color: $--color-text;
      }
    }
    .dialog-footer {
      display: flex;
      justify-content: space-between;
    }
  }
  .btn {
    outline: 0px;
    border: 0px rgb(18, 255, 128);
    margin: 0px;
    vertical-align: middle;
    min-width: 64px;
    color: rgba(0, 0, 0, 0.87);
    background-color: rgb(18, 255, 128);
    box-shadow: rgb(161 163 167) 0px 0px 2px;
    border-radius: 6px;
    font-weight: bold;
    line-height: 1.25;
    font-size: 14px;
    padding: 8px 24px;
    &:hover {
      text-decoration: none;
      background-color: rgb(12, 178, 89);
    }
  }
  .btn-danger {
    color: #e4e8ef;
    background-color: rgb(198, 32, 35);
    &:hover {
      background-color: rgba(198, 32, 35, 0.6);
    }
  }
  .btn-normal {
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    outline: 0px;
    min-width: 64px;
    border-radius: 6px;
    font-weight: bold;
    line-height: 1.25;
    text-transform: none;
    font-size: 16px;
    padding: 12px 24px;
    border: 0px rgb(18, 255, 128);
    &:hover {
      text-decoration: none;
      background-color: rgba(255, 255, 255, 0.08);
    }
  }
  .btn-size {
    padding: 8px 24px;
    min-width: 64px;
    border: 1px solid #303033;
    border-radius: 6px;
    font-weight: bold;
    line-height: 1.25;
    font-size: 14px;
  }

  .deposit-btn {
    color: $--color-text;
  }

  .btn-edit {
    background-color: rgb(72, 169, 166);
    &:hover {
      background-color: rgba(72, 169, 166, 0.6);
    }
  }
 .feature-container {
  display: flex;
  margin: 0px 24px;
  justify-content: space-between;
  align-items: baseline;
    .feature-header {
      color: rgb(255, 255, 255);
      font-weight: 700;
      margin: 0px;
      font-size: 24px;
      line-height: 30px;
      margin-bottom: 24px;
    }
    .feature-item > button{
      color: rgb(18, 255, 128);
      display: flex;
      height: 100%;
      align-items: flex-end;
      -webkit-box-pack: end;
      justify-content: flex-end;
      box-sizing: border-box;
      color: rgba(0, 0, 0, 0.87);
      background-color: rgb(18, 255, 128);
      box-shadow: rgb(161 163 167) 0px 0px 2px;
      border-radius: 6px;
      font-weight: bold;
      line-height: 1.25;
      text-transform: none;
      font-size: 16px;
      padding: 8px 32px;

      &:hover {
        text-decoration: none;
        background-color: rgb(12, 178, 89);
      }
    }
 }
 .action-item {
  display: flex;
  justify-content: flex-start;
  gap: 60px;
  align-items: center;
  .row-text {
    margin-left: 24px;
  }
 }
}
</style>
