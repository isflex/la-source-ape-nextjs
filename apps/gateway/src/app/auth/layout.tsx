import React from 'react';
import { headers } from 'next/headers';
import AuthPage from './page'

import classNames from 'classnames'
import {
  Text,
} from '@src/components/flex-server-components'
import { default as flexStyles } from '@flex-design-system/framework'

export default async function AuthLayout() {
  const _nonce = (await headers()).get('x-nonce')

  if (!_nonce) return (
    <section style={{ minHeight: '80vh' }}>
      <Text className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>Chargement...</Text>
    </section>
  )

  return (
    <section style={{ minHeight: '80vh' }}><AuthPage nonce={_nonce}/></section>
  );
}
