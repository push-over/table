<script>
export default {
  name: 'TableColumn',
  props: {
    defaultProps: {
      type: Object,
      default: () => {}
    }
  },
  render(h) {
    return this.defaultProps.type
      ? <el-table-column {...{ props: { ...this.defaultProps }}}/>
      : h('el-table-column',
        {
          props: { ...this.defaultProps }
        },
        [
          this.$scopedSlots.default
        ])
  }
}
</script>
