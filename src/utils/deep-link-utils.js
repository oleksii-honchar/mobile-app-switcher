function generateChromeDeepLink(platform, href, options = {}) {
  const appHref = href.replace(/https?\:\/\//, '')
  const genOptions = {
    omitExecutionCode: false,
    ...options,
  }

  let link = null
  let deepLink = null

  const makeExecutable = href => `javascript:window.open('${href}', '_system')`

  switch (platform) {
    case 'android':
      link = `intent:${appHref}#Intent;scheme=http;package=com.android.chrome;end`
      break
    case 'ios':
      link = `googlechrome://${appHref}`
      break
    case 'mac':
      link = appHref
      break
    default:
      throw new Error(
        `generateChromeDeepLink() "${platform}" is not supported!`
      )
  }

  if (genOptions.omitExecutionCode) return link

  deepLink = makeExecutable(link)
  return deepLink
}

export function generateApplicationDeepLink(
  platform,
  appName,
  href,
  options = {}
) {
  let link = null
  switch (appName) {
    case 'chrome':
      link = generateChromeDeepLink(platform, href, options)
      break
    default:
      throw new Error(
        `generateApplicationDeepLink() "${appName}" is not supported!`
      )
  }

  return link
}
