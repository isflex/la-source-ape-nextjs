export declare type SlideStatus = 'unopened' | 'viewing' | 'read'

export declare interface SpaghettiInterface {
  routes: {
    ['pourquoi-ce-site']: {
      status: SlideStatus
    }
    ['dans-quel-but']: {
      status: SlideStatus
    }
    ['qu-est-ce-que-c-est']: {
      status: SlideStatus
    }
    ['comment-contribuer']: {
      status: SlideStatus
    }
  }
}
