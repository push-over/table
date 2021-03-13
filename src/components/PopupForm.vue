<template>
  <el-dialog
    :modal-append-to-body="false"
    :title="`${isUpdating ? 'Edit' : 'Create'} ${title}`"
    :visible.sync="isOpen"
    width="35%"
  >

    <div class="section">
      <slot :value.sync="formValue" />
    </div>

    <div slot="footer">
      <el-button @click="closeForm">Cancel</el-button>
      <el-button type="primary" @click="saveForm">Save</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PopupForm',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      isOpen: false,
      loading: false,
      isUpdating: false,
      formValue: {}
    }
  },
  watch: {
    value(newValue) {
      this.isOpen = newValue
    },
    isOpen(newValue) {
      this.$emit('input', newValue)
    }
  },
  methods: {
    closeForm() {
      this.isOpen = false
    },
    resetForm() {
      this.isUpdating = false
      Object.assign(this.formValue, this.defaultValue)
    },
    async saveForm() {
      this.loading = true
      this.$emit('save', this.formValue, this.isUpdating)
      this.loading = false
      this.closeForm()
      setTimeout(() => {
        this.resetForm()
      }, 500)
    },
    editItem(item) {
      this.isUpdating = !!item
      // this.formValue = { ...this.defaultValue, ...{}, ...item }
      this.formValue = Object.assign(this.defaultValue, {}, item)
      this.isOpen = true
    }
  }
}
</script>
