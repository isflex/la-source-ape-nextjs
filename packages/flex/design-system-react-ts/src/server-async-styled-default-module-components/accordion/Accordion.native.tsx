import React from 'react'
import { StyleSheet } from 'react-native'
import { AccordionProps } from './AccordionProps'
import { View } from '../view'

/**
 * Accordion Component
 * @param boxed {boolean} Boxed Accordion
 */
const Accordion = ({ boxed, ...others }: AccordionProps): React.JSX.Element => {
  const boxedBgc = '#fff'

  const styles = StyleSheet.create({
    accordion: {
      width: '100%',
      minHeight: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
    boxed: {
      backgroundColor: boxedBgc,
      shadowColor: 'rgba(0,0,0,.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
  })

  return <View style={[styles.accordion, boxed && styles.boxed]} {...others} />
}

export default Accordion
