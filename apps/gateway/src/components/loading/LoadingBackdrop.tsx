import React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import classNames from 'classnames'
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { default as flexStyles } from '@flex-design-system/framework';

interface LoadingBackdropProps {
  loadingText?: string
}

const LoadingBackdrop: React.FC<LoadingBackdropProps> = ({loadingText}) => {
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={true}
    >
      <div className={classNames(
        flexStyles.isFlex, flexStyles.isFlexDirectionColumn, flexStyles.isAlignItemsCenter, flexStyles.isFullwidth
      )}>
        <CircularProgress color='inherit' />
        {loadingText && (
          <Text style={{ marginTop: '1rem' }}>{loadingText}</Text>
        )}
      </div>
    </Backdrop>
  )
}

export { LoadingBackdrop }
