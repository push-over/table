export function useFullScreen({
  target = document.documentElement,
  options
}) {
  const _this = this
  _this.isFullscreenRef = false
  const el = document.documentElement
  let RFC_METHOD_NAME = 'requestFullscreen'
  let EFS_METHOD_NAME = 'exitFullscreen'
  let FSE_PROP_NAME = 'fullscreenElement'
  let EVENT_CHANGE_NAME = 'fullscreenchange'

  if ('webkitRequestFullScreen' in el) {
    RFC_METHOD_NAME = 'webkitRequestFullScreen'
    EFS_METHOD_NAME = 'webkitExitFullscreen'
    FSE_PROP_NAME = 'webkitFullscreenElement'
    EVENT_CHANGE_NAME = 'webkitfullscreenchange'
  } else if ('msRequestFullscreen' in el) {
    RFC_METHOD_NAME = 'msRequestFullscreen'
    EFS_METHOD_NAME = 'msExitFullscreen'
    FSE_PROP_NAME = 'msFullscreenElement'
    EVENT_CHANGE_NAME = 'MSFullscreenChange'
  } else if ('mozRequestFullScreen' in el) {
    RFC_METHOD_NAME = 'mozRequestFullScreen'
    EFS_METHOD_NAME = 'mozCancelFullScreen'
    FSE_PROP_NAME = 'mozFullScreenElement'
    EVENT_CHANGE_NAME = 'mozfullscreenchange'
  } else if (!('requestFullscreen' in el)) {
    throw new Error('当前浏览器不支持Fullscreen API !')
  }

  function enterFullscreen() {
    addEventListener()
    _this.isFullscreenRef = true
    return target[RFC_METHOD_NAME](options)
  }

  function exitFullscreen() {
    _this.isFullscreenRef = false
    return document[EFS_METHOD_NAME]()
  }

  function isFullscreen() {
    return target === (document)[FSE_PROP_NAME]
  }

  function eventListenerFullscreenEnabled() {
    const isFullscreenRef = _this.$refs.tableRef.fullscreenEnabled ||
      window.fullScreen ||
      document.webkitIsFullScreen ||
      document.msFullscreenEnabled
    if (!isFullscreenRef) _this.isFullscreenRef = false
  }

  function addEventListener() {
    document.addEventListener(EVENT_CHANGE_NAME, eventListenerFullscreenEnabled)
  }

  function removeEventListener() {
    document.removeEventListener(EVENT_CHANGE_NAME, eventListenerFullscreenEnabled)
  }

  async function toggleFullscreen() {
    if (!target) return

    if (isFullscreen()) return exitFullscreen()
    else return enterFullscreen()
  }

  return {
    toggleFullscreen,
    exitFullscreen,
    isFullscreen,
    enterFullscreen,
    addEventListener,
    removeEventListener
  }
}

