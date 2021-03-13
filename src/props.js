export const basicProps = {
  columns: {
    type: Array,
    default: () => {
      return []
    }
  },
  entity: {
    type: Object,
    default: () => {
      return {}
    }
  },
  actions: {
    type: Object,
    default: () => {
      return {}
    }
  },
  pagination: {
    type: Object,
    default: () => {
      return {}
    }
  },
  fields: {
    type: Object,
    default: () => {
      return {}
    }
  }
}
