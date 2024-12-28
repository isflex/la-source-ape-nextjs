import { keys, isUndefined, forIn, zipObject } from 'lodash'

let memoryHasMap = {}

const memory = {
  _syncItemsCount () {
    this.length = keys(memoryHasMap).length
  },
  getItem (key) {
    return memoryHasMap[key] || null
  },
  setItem (key, value) {
    memoryHasMap[key] = value
    this._syncItemsCount()
  },
  removeItem (key) {
    delete memoryHasMap[key]
    this._syncItemsCount()
  },
  clear () {
    memoryHasMap = null
    memoryHasMap = {}
    this._syncItemsCount()
  },
  length: 0,
  key (n) {
    if (isUndefined(n)) {
      throw new Error('1 argument required, but only 0 present.')
    }

    return keys(memoryHasMap)[n] || null
  }
}

const isStorageSupported = (function () { // eslint-disable-line wrap-iife
  try {
    const hasStorage = typeof window.sessionStorage !== 'undefined' &&
      ('setItem' in window.sessionStorage) && window.sessionStorage.setItem

    if (!hasStorage) {
      return false
    }

    const uid = new Date()
    window.sessionStorage.setItem(uid, uid)
    window.sessionStorage.removeItem(uid)

    return true
  } catch (e) {
    return false
  }
})()

const storage = isStorageSupported ? window.sessionStorage : memory

class Session {
  constructor(namespace, separator) {
    // this.namespace = namespace || 'flexiness'
    this.namespace = namespace || 'a360'
    this.separator = separator || '-'
  }

  prefix(namespace, separator) {
    return namespace ? namespace + (separator || this.separator) : ''
  }

  property(name, namespace) {
    return namespace ? this.prefix(namespace) + name : this.prefix(this.namespace) + name
  }

  setItems(items, prefix) {
    const _prefix = this.prefix(prefix)

    forIn(items, (value, key) => {
      this.setItem(_prefix + key, value)
    })
  }

  getItems(items, prefix) {
    const _prefix = this.prefix(prefix)
    const values = items.map((value) => {
      return this.getItem(_prefix + value)
    })

    return zipObject(items, values)
  }

  setItem(name, value) {
    return storage.setItem(this.property(name), value)
  }

  getItem(name) {
    return storage.getItem(this.property(name)) || storage.getItem(this.property(name, 'core'))
  }

  hasItem(name) {
    const value = storage.getItem(this.property(name)) || storage.getItem(this.property(name, 'core'))

    return Boolean(value)
  }

  clearItem(name) {
    return storage.removeItem(this.property(name))
  }

  personId() {
    return this.getItem('pid')
  }

  clear() {
    storage.clear()
  }
  /* eslint-disable */
  useSession(sess = {}) {
    for (const key in sess) {
      if (sess.hasOwnProperty(key) && !session[key]) {
        session[key] = sess[key]
      }
    }
    session.__proto__ = {
      ...sess.__proto__,
      ...session.__proto__
    }
  }
}

/* eslint-enable */

let session = globalThis?.Flexiness?.domainApp?.session
export function getSession() {
  if (!session) {
    session = new Session()
    session.isPersistent = isStorageSupported
    globalThis.Flexiness = {
      ...globalThis?.Flexiness,
      domainApp: { ...globalThis?.Flexiness?.domainApp, session }
    }
  }
  return session
}
