'use client'

import React from 'react'
import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'
const stores = getStores()

import classNames from 'classnames'
import {
  Title,
  Text,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import {
  TitleLevel
 } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

const TitleContent = ({mobileCheck}) => {
  const { spaghettiContext } = stores.SpaghettiStore
  let makeSpaceMobile = false
  if (
    mobileCheck &&
    (
      spaghettiContext.routes['pourquoi-ce-site'].status === 'read' ||
      spaghettiContext.routes['dans-quel-but'].status === 'read'
    )
  ) {
    makeSpaceMobile = true
  }
  return (
    <div className={classNames(makeSpaceMobile && stylesPage.makeSpaceMobile)}>
      {spaghettiContext.routes['qu-est-ce-que-c-est'].status !== 'read' && (
        <>
          <Title level={TitleLevel.LEVEL2} className={classNames(flexStyles.isCentered)} style={{ margin: '0' }}>
          {`À propos de ce site`}
          </Title>
          {!mobileCheck && (
            <Text className={classNames(flexStyles.hasTextCentered, flexStyles.isItalic)} style={{ margin: '0.5rem auto 0' }}>
              {/* {`Décortiquons ensemble ce sac de noeuds`} */}
              {`Suivez les fils conducteurs pour lancer le projet`}
            </Text>
          )}
        </>
      )}
    </div>
  )
}

export default observer(TitleContent)
