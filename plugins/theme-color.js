export default ({ $colorMode }) => {
  if (process.client) {
    if (window) {
      const SETTER_DELAY = 2000

      setTimeout(() => {
        if ($colorMode.preference === 'dark') {
          document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#161616')
          document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', 'black')
        } else {
          document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#eeeeee')
          document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', 'default')
        }
      }, SETTER_DELAY)
    }
  }
}
