import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AccordionHeaderProps } from './AccordionHeaderProps'

/**
 * Accordion Header
 * @param children {ReactNode}
 */
const AccordionHeader = ({ children }: AccordionHeaderProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    header: {
      maxWidth: '95%',
      minWidth: '95%',
      width: '95%',
    },
  })

  return <View style={styles.header}>{children}</View>
}

export default AccordionHeader
