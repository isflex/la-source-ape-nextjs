import { isServer } from '@src/utils'

import { enableStaticRendering } from 'mobx-react-lite'
enableStaticRendering(isServer)

import { getUIStore } from '@flexiness/domain-store'
const UIStore = getUIStore()

export const RootStore = {
  UIStore,
}
