import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AccordionHeaderProps } from './AccordionHeaderProps'

/**
 * Accordion Header
 * @param children {ReactNode}
 */
const AccordionAction = ({ children }: AccordionHeaderProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    action: {
      maxWidth: '95%',
      minWidth: '95%',
      width: '95%',
    },
  })

  return <View style={styles.action}>{children}</View>
}

export default AccordionAction
