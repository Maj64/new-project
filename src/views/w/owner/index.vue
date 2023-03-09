<template>
  <div class="app-container">
    <div class="feature-container">
      <div class="feature-header">Owner</div>
      <div class="feature-item">
        <button class="btn btn-add" @click="handleAdd">Add</button>
      </div>
    </div>
    <Table
      :columns="columns"
      :data-source="owners"
    />
    <Form :dialog-data="dialogData" :data-form="owner" :form-list="formList">
      <template v-slot:footerDialog>
        <el-button type="info" class="btn-normal" plain>Cancel</el-button>
        <el-button type="success" class="btn">Add</el-button>
      </template>
    </Form>
  </div>
</template>

<script>
import Table from '@/components/MyTableComponent/Table.vue'
import Form from '@/components/MyDialogComponent/Form.vue'
export default {
  name: 'Owner',
  components: {
    Table,
    Form
  },
  data() {
    return {
      dialogData: {
        title: '',
        dialogVisible: false,
        template: 'footerDialog'
      },
      formList: [
        { type: 'text', label: 'Name', field: 'name' },
        { type: 'text', label: 'Address', field: 'address' }
      ],
      columns: [
        { name: 'Name', field: 'name' },
        { name: 'Address', field: 'address', unShorten: true }
      ],
      owners: [
        {
          name: 'Account 0',
          address: 'f8ef8939fccccccdfr483yfe89fhdfhdfhdofhdosfhoidhfodshf3dchdi'
        }
      ],
      owner: {
        name: '',
        address: ''
      }
    }
  },
  methods: {
    handleAdd() {
      this.dialogData = {
        title: 'Add',
        dialogVisible: true,
        template: 'footerDialog'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-text: rgb(255, 255, 255);
$--color-border-light: #303033;
$--space-3: 24px;
.app-container {

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
  justify-content: space-evenly;
  align-items: center;
 }
}
</style>
