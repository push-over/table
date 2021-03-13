<template>
  <el-button
    v-if="action.enabled"
    :type="type"
    :icon="action.icon"
    @click="$emit('click')"
  >
    {{ action.label }}
  </el-button>
</template>

<script>
export default {
  name: 'TableTopButton',
  props: {
    action: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'primary'
    }
  }
}
</script>

