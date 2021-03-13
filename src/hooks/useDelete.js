export function useDelete(callback) {
  this.$msgbox({
    title: '提示',
    message: `此操作将永久删除该${this.entity.displayName}, 是否继续?`,
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    beforeClose: async(action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '执行中...'
        done()
        await callback()
        instance.confirmButtonLoading = false
        await this.refreshTable()
      } else done()
    }
  }).then(() => {
    this.$message({
      type: 'success',
      message: `${this.entity.displayName}删除成功!`
    })
  }).catch(() => {
    this.$message({
      type: 'info',
      message: '已取消删除'
    })
  })
}
