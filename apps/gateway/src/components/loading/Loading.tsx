import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import classNames from 'classnames'
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { default as flexStyles } from '@flex-design-system/framework';

const Loading = () => {
  return (
    <div
      className={classNames(flexStyles.isFlex, flexStyles.isFlexDirectionColumn, flexStyles.isAlignItemsCenter, flexStyles.isFullwidth)}
      style={{ color: '#b86bff' }}
    >
      <CircularProgress color='inherit' />
      <Text style={{ marginTop: '1rem', color: 'inherit' }}>Chargement...</Text>
    </div>
  )
}

export { Loading }
