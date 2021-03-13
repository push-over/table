import { extend } from '../utils'

export function useAction(props) {
  const actionsDefaults = {
    search: {
      enabled: true,
      icon: 'el-icon-search',
      label: 'Search',
      position: 'top-left'
    },
    create: {
      enabled: true,
      icon: 'el-icon-plus',
      label: `新增${props.entity.displayName || ''}`,
      position: 'top-right'
    },
    deleteBatch: {
      enabled: true,
      icon: 'el-icon-delete',
      label: '批量删除',
      position: 'top-right'
    },
    screen: {
      enabled: true,
      icon: 'el-icon-full-screen',
      label: this.isFullscreenRef ? '取消全屏' : '全屏',
      position: 'top-right'
    },
    quickCreate: {
      enabled: false,
      icon: 'el-icon-plus',
      label: `新增${props.entity.displayName || ''}`,
      position: 'top-right'
    },
    quickEdit: {
      enabled: true,
      icon: 'el-icon-edit',
      label: 'Quick Edit'
    },
    edit: {
      enabled: true,
      icon: 'el-icon-edit-outline',
      label: 'Edit'
    },
    delete: {
      enabled: true,
      icon: 'el-icon-delete',
      label: 'Delete'
    }
  }

  return extend(true, actionsDefaults, props.actions)
}
