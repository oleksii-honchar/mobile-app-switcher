export function getMasEl () {
  let masEl = document.getElementById('o-mas-vanilla')
  if (!!masEl) return masEl

  masEl = document.createElement('div')
  masEl.id = 'o-mas-vanilla'

  document.body.appendChild(masEl)

  return masEl
}

export function removeMasEl() {
  const oMasEl = document.getElementById('o-mas-vanilla')
  !!oMasEl && oMasEl.parentNode.removeChild(oMasEl)
}

export function isEmptyObject (obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function onDocReady(fn) {
  // see if DOM is already available
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // call on next available tick
    setTimeout(fn, 1)
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

export function pushLog (data) {
  const bodyLogEl = document.getElementsByClassName('o-mas-body-log')[0]
  if (!bodyLogEl) return

  const logEl = document.createElement('span')
  logEl.className = 'o-log-item'
  logEl.innerText = data

  bodyLogEl.appendChild(logEl)
}

// simplified version of hooks to keep logic similar to react version
export function useState (name, initialValue = null) {
  let value = initialValue

  const setValue = (newValue) => {
    value = newValue

    const msg = 'mas:' + JSON.stringify({
      name,
      value
    })
    window.postMessage(msg, '*')
  }

  return [
    () => value,
    setValue
  ]
}

export function useEffect (callback, dependencies = null) {
  function checkIfMasMessage (message, callback, dependencies) {
    if (typeof message.data !== 'string') return
    if (!message.data.startsWith('mas:')) return

    const strData = message.data.replace('mas:','')
    let data = null
    try {
      data = JSON.parse(strData)
    } catch (e) {
      console.error(e)
      return
    }

    // <empty> case - trigger every time
    if (dependencies === null) return callback()

    // [<name>] trigger if watched value changed
    if (Array.isArray(dependencies) && dependencies.indexOf(data.name) >= 0) return callback()
  }

  // [] trigger once
  if (Array.isArray(dependencies) && dependencies.length === 0) return callback()

  window.addEventListener(
    'message',
    (msg) => checkIfMasMessage(msg, callback, dependencies),
    false
  )
}

export function classNames(baseNames, conditionalNames = {}) {
  if (isEmptyObject(conditionalNames)) return baseNames

  let res = baseNames
  for (const key in conditionalNames) {
    if (conditionalNames[key]) res += ' ' + key
  }

  return res
}

export const Cookies = {
  get: function get(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2)
      return parts.pop().split(";").shift();
    else
      return "";
  },
  set: function (cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  remove: function (cname) {
    Cookies.set(cname, '', -1)
  }
}

