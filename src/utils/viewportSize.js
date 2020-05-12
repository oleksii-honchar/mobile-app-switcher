// sources from https://github.com/jarvys/viewportSize

const isBrowser = typeof window !== 'undefined'

function getSize(Name) {
  let size
  let name = Name.toLowerCase()
  let document = window.document
  let documentElement = document.documentElement
  if (window['inner' + Name] === undefined) {
    // IE6 & IE7 don't have window.innerWidth or innerHeight
    size = documentElement['client' + Name]
  } else if (window['inner' + Name] !== documentElement['client' + Name]) {
    // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy

    // Insert markup to test if a media query will match document.doumentElement["client" + Name]
    let bodyElement = document.createElement('body')
    bodyElement.id = 'vpw-test-b'
    bodyElement.style.cssText = 'overflow:scroll'
    let divElement = document.createElement('div')
    divElement.id = 'vpw-test-d'
    divElement.style.cssText = 'position:absolute;top:-1000px'
    // Getting specific on the CSS selector so it won't get overridden easily
    divElement.innerHTML =
      '<style>@media(' +
      name +
      ':' +
      documentElement['client' + Name] +
      'px){body#vpw-test-b div#vpw-test-d{' +
      name +
      ':7px!important}}</style>'
    bodyElement.appendChild(divElement)
    documentElement.insertBefore(bodyElement, document.head)

    if (divElement['offset' + Name] === 7) {
      // Media query matches document.documentElement["client" + Name]
      size = documentElement['client' + Name]
    } else {
      // Media query didn't match, use window["inner" + Name]
      size = window['inner' + Name]
    }
    // Cleanup
    documentElement.removeChild(bodyElement)
  } else {
    // Default to use window["inner" + Name]
    size = window['inner' + Name]
  }
  return size
}

export function getHeight() {
  return (isBrowser && getSize('Height')) ?? null
}
export function getWidth() {
  return (isBrowser && getSize('Width')) ?? null
}
