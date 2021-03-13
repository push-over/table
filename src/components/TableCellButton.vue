<template>
  <el-tooltip
    v-if="action.enabled"
    :content="action.label"
    effect="dark"
    placement="bottom"
  >
    <i
      :class="[action.icon, 'cell-btn']"
      @click="$emit('click')"
    />
  </el-tooltip>

</template>

<script>
export default {
  name: 'TableCellButton',
  props: {
    action: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-btn {
  margin: 0 5px;
  cursor: pointer;
  font-size: 20px;
}
</style>
