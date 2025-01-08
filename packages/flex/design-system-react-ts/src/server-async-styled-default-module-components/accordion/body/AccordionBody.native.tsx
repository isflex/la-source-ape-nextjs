import React from 'react'
import { StyleSheet } from 'react-native'
import { AccordionBodyProps } from './AccordionBodyProps'
import { View } from '../../view'

/**
 * Accordion Header
 * @param children {ReactNode} Children for Accordion body
 */
const AccordionBody = ({ children, ...others }: AccordionBodyProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    accordionBody: {},
  })

  return (
    <View style={[styles.accordionBody]} {...others}>
      {children}
    </View>
  )
}

export default AccordionBody
