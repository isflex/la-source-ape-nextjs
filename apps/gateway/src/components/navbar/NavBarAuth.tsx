// /* eslint-disable no-console */

// 'use client'

// import React from 'react'
// import { observer } from 'mobx-react-lite'
// import {
//   getStores,
//   // useStores
// } from '@flexiness/domain-store'
// const stores = getStores()
// import Link from 'next/link'
// // import classNames from 'classnames'
// import { Divider, Flex } from '@aws-amplify/ui-react'
// import { signOut } from 'aws-amplify/auth'
// import { useRouter } from 'next/navigation'
// // import { AuthSteps } from '@src/components/auth/AuthComponent'
// import { Hub } from 'aws-amplify/utils'
// import {
//   useAuthenticator,
// } from '@aws-amplify/ui-react'

// import { flexStyles, Button, VariantState, Title, View } from '@flex-design-system/react-ts/client-sync-styled-default'

// const NavBarAuth = observer(({ isSignedIn }: { isSignedIn: boolean }) => {
//   const { triggerAuthentication, setAmplifyAuthState  } = stores.UIStore
//   // const {
//   //   UIStore: { triggerAuthentication, setAmplifyAuthState },
//   // } = useStores()

//   const [authCheck, setAuthCheck] = React.useState(isSignedIn)
//   const [showAuthenticator, setShowAuthenticator] = React.useState(false)
//   // const [isPending, startTransition] = React.useTransition()

//   const router = useRouter()
//   React.useEffect(() => {
//     const hubListenerCancel = Hub.listen('auth', (data) => {
//       switch (data.payload.event) {
//         case 'signedIn':
//           if (process.env.DEBUG === 'true') console.log('user have been signedIn successfully.')
//           setAuthCheck(true)
//           setAmplifyAuthState(true)
//           // startTransition(() => router.push('/'))
//           // startTransition(() => router.refresh())
//           break
//         case 'signedOut':
//           if (process.env.DEBUG === 'true') console.log('user have been signedOut successfully.')
//           setAuthCheck(false)
//           setAmplifyAuthState(false)
//           // startTransition(() => router.push('/'))
//           // startTransition(() => router.refresh())
//           break
//         case 'tokenRefresh':
//           if (process.env.DEBUG === 'true') console.log('auth tokens have been refreshed.')
//           break
//         case 'tokenRefresh_failure':
//           if (process.env.DEBUG === 'true') console.log('failure while refreshing auth tokens.')
//           break
//         case 'signInWithRedirect':
//           if (process.env.DEBUG === 'true') console.log('signInWithRedirect API has successfully been resolved.')
//           break
//         case 'signInWithRedirect_failure':
//           if (process.env.DEBUG === 'true') console.log('failure while trying to resolve signInWithRedirect API.')
//           break
//         // case 'customOAuthState':
//         //   logger.info('custom state returned from CognitoHosted UI')
//         //   break
//         default:
//           break
//       }
//     })

//     return () => hubListenerCancel()
//   }, [router])

//   const signOutSignIn = async () => {
//     if (authCheck) {
//       // setAmplifyAuthState(false)
//       await signOut()
//     } else {
//       // router.push('/signin')
//       setShowAuthenticator(true)
//       return null
//     }
//   }

//   const defaultRoutes = [
//     {
//       href: '/',
//       label: 'Home',
//     },
//     {
//       href: '/onboard',
//       label: 'Onboard',
//       loggedIn: true,
//     },
//   ]

//   const AuthSignedIn = () => {
//     const { user } = useAuthenticator((context) => [context.user])
//     return (
//       <main>
//         <Title level={6}>Hello {user?.username}</Title>
//       </main>
//     )
//   }

//   const routes = defaultRoutes.filter((route) => route.loggedIn === authCheck || route.loggedIn === undefined)

//   return (
//     <View>
//       <Flex direction='row' justifyContent='space-between' alignItems='center' padding={'1rem'}>
//         {authCheck && <AuthSignedIn />}

//         <Flex as='nav' alignItems='center' gap='3rem' margin='0 2rem'>
//           {routes.map((route) => (
//             <Link key={route.href} href={route.href} className={flexStyles.link}>
//               {route.label}
//             </Link>
//           ))}
//         </Flex>

//         <Button id='navBarSignInOrSignOutButton' small variant={VariantState.SECONDARY} onClick={() => void signOutSignIn()}>
//           {authCheck ? 'Sign Out' : 'Sign In'}
//         </Button>
//       </Flex>
//       {/* {(showAuthenticator || triggerAuthentication) && !authCheck && <AuthSteps />} */}
//       <Divider size='small'></Divider>
//     </View>
//   )
// })

// export default NavBarAuth

export {}
