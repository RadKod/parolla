export default function (context) {
  const isFromPc = context.$ua.isFromPc()
  const isFromMobilePhone = context.$ua.isFromMobilephone()
  const isFromTablet = context.$ua.isFromTablet()
  const deviceType = context.$ua.deviceType()
  const os = context.$ua.os()
  const browser = context.$ua.browser()
  const isFromIphone = context.$ua.isFromIphone()
  const isFromIpad = context.$ua.isFromIpad()
  const isFromIos = context.$ua.isFromIos()
  const isFromAndroidOs = context.$ua.isFromAndroidOs()

  if (process.client || process.browser) {
    document.documentElement.setAttribute('ua-is-from-pc', isFromPc)
    document.documentElement.setAttribute('ua-is-from-mobile-phone', isFromMobilePhone)
    document.documentElement.setAttribute('ua-is-from-tablet', isFromTablet)
    document.documentElement.setAttribute('ua-device-type', deviceType)
    document.documentElement.setAttribute('ua-os', os)
    document.documentElement.setAttribute('ua-browser', browser)
    document.documentElement.setAttribute('ua-is-from-iphone', isFromIphone)
    document.documentElement.setAttribute('ua-is-from-ipad', isFromIpad)
    document.documentElement.setAttribute('ua-is-from-ios', isFromIos)
    document.documentElement.setAttribute('ua-is-from-android-os', isFromAndroidOs)
  }
}
