/* eslint-disable no-console */
import {
  action,
  // toJS,
  makeAutoObservable,
  observable,
} from 'mobx'

import { AppContextInterface, FlexGlobalThis, FlexI18next, NavigationState, PrefetchInterface, StatusFrontend, demoPageFile } from 'flexiness'

import { isMobile } from 'react-device-detect'

// import localForage from 'localforage'
import { makePersistable } from 'mobx-persist-store'
// import { makePersistable, getPersistedStore } from 'mobx-persist-store'
import { isServer } from './utils/index.js'

declare let globalThis: FlexGlobalThis
// declare type getUIStore = () => UserInterfaceStore
export class UserInterfaceStore {
  constructor(
    public appContext: AppContextInterface,
    public navigationState: NavigationState,
    public demoPage: demoPageFile,
    public status: StatusFrontend,
    public prefetchData: PrefetchInterface,
    public flexI18next: FlexI18next,
    public werewolfCount: number,
    public amplifyAuthState: boolean,
    public activeTableId: string | null,
    public modalCreateOnBoardEventOpen: boolean,
    public modalUpdateEventAddOpen: boolean | string,
    public authenticationOnLoad: boolean,
    public triggerAuthentication: boolean,
    public nextTokenPage: string | null,
    public errorStatus: boolean,
    public noFilteredResults: boolean,
    public userSub: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public userAuth: Record<string, any> | null,
  ) {
    makeAutoObservable(this, {
      appContext: observable,
      setAppContext: action,
      navigationState: observable,
      setNavigationState: action,
      demoPage: observable,
      setDemoPage: action,
      setStatus: action,
      setPrefetchData: action,
      flexI18next: observable,
      setFlexI18next: action,
      werewolfCount: observable,
      setWerewolfCount: action,
      amplifyAuthState: observable,
      setAmplifyAuthState: action,
      activeTableId: observable,
      setActiveTableId: action,
      modalCreateOnBoardEventOpen: observable,
      setModalCreateOnBoardEventOpen: action,
      modalUpdateEventAddOpen: observable,
      setModalUpdateEventAddOpen: action,
      authenticationOnLoad: observable,
      setAuthenticationOnLoad: action,
      triggerAuthentication: observable,
      setTriggerAuthentication: action,
      nextTokenPage: observable,
      setNextTokenPage: action,
      errorStatus: observable,
      setToggleErrorStatus: action,
      noFilteredResults: observable,
      setNoFilteredResults: action,
      userSub: observable,
      setUserSub: action,
      unsetUserSub: action,
      userAuth: observable,
      setUserAuth: action,
      unsetUserAuth: action,
    })

    void makePersistable(this, {
      name: 'FlexUserInterfaceStore',
      properties: ['modalCreateOnBoardEventOpen', 'authenticationOnLoad', 'triggerAuthentication', 'amplifyAuthState'],
      storage: !isServer ? window.localStorage : undefined,
    })
  }

  setAppContext = (newAppContext: AppContextInterface) => {
    this.appContext = newAppContext
  }

  setNavigationState = (newState: NavigationState) => {
    this.navigationState = newState
  }

  setDemoPage = (newPageFile: demoPageFile) => {
    this.demoPage = newPageFile
  }

  setStatus = (newStatus: StatusFrontend) => {
    this.status = newStatus
  }

  setPrefetchData = (newPrefetchedData: PrefetchInterface) => {
    this.prefetchData = newPrefetchedData
  }

  setFlexI18next = (newFlexI18next: FlexI18next) => {
    this.flexI18next = newFlexI18next
    console.log('///////////////////////////////////////////////////////////////////')
    console.log('UIStore resolvedLanguage', this.flexI18next?.resolvedLanguage)
    console.log('///////////////////////////////////////////////////////////////////')
    this.setAppContext({
      ...this.appContext,
      language: this.flexI18next?.resolvedLanguage,
    })
  }

  setWerewolfCount = (newWerewolfCount: number) => {
    this.werewolfCount = newWerewolfCount
  }

  setAmplifyAuthState = (newAuthState: boolean) => {
    this.amplifyAuthState = newAuthState
  }

  setActiveTableId = (newActiveTableId: string) => {
    this.activeTableId = newActiveTableId
  }

  setModalCreateOnBoardEventOpen = (status: boolean) => {
    this.modalCreateOnBoardEventOpen = status
    // this.modalUpdateEventAddOpen = false
  }

  setModalUpdateEventAddOpen = (status: boolean | string) => {
    this.modalUpdateEventAddOpen = status
    // this.modalCreateOnBoardEventOpen = false
  }

  setAuthenticationOnLoad = (status: boolean) => {
    this.authenticationOnLoad = status
  }

  /**
   * Triggers Authentication modal
   * @param {boolean} showAuthModal display or not the authentification modal
   * @param {boolean} showCreateEventModal display or not the create onboard event modal afterwards
   * @returns {void}
   */
  setTriggerAuthentication = (showAuthModal: boolean, showCreateEventModal?: boolean) => {
    this.triggerAuthentication = showAuthModal
    if (showCreateEventModal) this.modalCreateOnBoardEventOpen = !this.modalCreateOnBoardEventOpen
  }

  setNextTokenPage = (token: string) => {
    this.nextTokenPage = token
  }

  setToggleErrorStatus = () => {
    this.errorStatus = !this.errorStatus
  }

  setNoFilteredResults = (status: boolean) => {
    this.noFilteredResults = status
  }

  setUserSub = (data: string) => {
    this.userSub = data
  }

  unsetUserSub = () => {
    this.userSub = null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUserAuth = (data: Record<string, any>) => {
    this.userAuth = data
  }

  unsetUserAuth = () => {
    this.userAuth = null
  }
}

let UIStore: UserInterfaceStore | undefined = globalThis.Flexiness?.domainApp?.UIStore
export function getUIStore() {
  if (!UIStore) {
    UIStore = new UserInterfaceStore(
      // appContext
      {
        theme: {
          palette: {
            mode: 'light',
          },
        },
        // Rest when setFlexI18next is called
        // language: defaultLocale,
        language: 'fr',
        debug: false,
        cssMode: 'CSS Modules',
        overlayMode: false,
      },

      // navigationState
      'fullpage',

      // demoPage
      'default',

      // status
      null,

      // prefetch
      {} as PrefetchInterface,

      // i18n
      {} as FlexI18next,

      // werewolfCount
      isMobile ? 1 : 0,

      // amplifyAuthState
      false,

      // activeTableId
      null,

      // modalCreateOnBoardEventOpen
      false,

      // modalUpdateEventAddOpen
      false,

      // authenticationOnLoad
      false,

      // triggerAuthentication
      false,

      // nextTokenPage
      null,

      // errorStatus
      false,

      // noFilteredResults
      false,

      // userSub
      null,

      // userAuth
      null,
    )
    globalThis.Flexiness = {
      ...globalThis.Flexiness,
      domainApp: { ...globalThis.Flexiness?.domainApp, UIStore },
    }
  }
  return UIStore
}
