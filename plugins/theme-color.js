export default ({ $colorMode }) => {
  if (process.client) {
    if (window) {
      const SETTER_DELAY = 2000

      setTimeout(() => {
        if ($colorMode.preference === 'dark') {
          document.querySelector('meta[name="theme-color"]').setAttribute('content', '#161616')
        } else {
          document.querySelector('meta[name="theme-color"]').setAttribute('content', '#eeeeee')
        }
      }, SETTER_DELAY)
    }
  }
}
