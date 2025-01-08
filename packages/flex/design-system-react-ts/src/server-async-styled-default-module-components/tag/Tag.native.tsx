import React, { useState, useEffect } from 'react'
import { StyleSheet, Text } from 'react-native'
import { TagProps, TagClickEvent } from './TagProps'
import { TagVariant } from './TagEnum'
import { View } from '../view'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import icoMoonConfig from '../../assets/fonts/icons/selection.json'
import { IconName } from '../icon'

const CustomIcon = createIconSetFromFontello(icoMoonConfig)
/**
 * Tag Component
 * @param children {ReactNode} Add childrens for tag
 * @param variant {TagVariant} Available tag variants
 * @param deletable {boolean} Adding delete icon
 * @param onClick {Function} OnClick Event
 */
const Tag = ({ children, variant, deletable, onClick, ...others }: TagProps): Promise<React.JSX.Element> => {
  const [display, setDisplay] = useState<boolean>(deletable || false)

  useEffect(() => {
    setDisplay(deletable || false)
  }, [deletable])

  const primaryBgc = 'rgba(37,70,95,.1)'
  const secondaryBgc = 'rgba(16,157,185,.1)'
  const primaryColor = '#25465f'
  const secondaryColor = '#109db9'

  const styles = StyleSheet.create({
    tag: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'baseline',
      minWidth: 75,
      height: 24,
      borderRadius: 15,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor:
        (variant === TagVariant.DEFAULT && primaryBgc) ||
        (variant === TagVariant.SECONDARY && secondaryBgc) ||
        primaryBgc,
    },
    text: {
      alignSelf: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      justifyContent: 'center',
      color:
        (variant === TagVariant.DEFAULT && primaryColor) ||
        (variant === TagVariant.SECONDARY && secondaryColor) ||
        primaryColor,
    },
    icon: {
      marginTop: 1,
    },
  })

  const onClickHandle = (e: TagClickEvent) => {
    setDisplay(!display)
    if (onClick) {
      onClick(e)
    }
  }

  // Deletable tag
  if (deletable && display) {
    return (
      <View style={styles.tag} {...others}>
        <Text style={styles.text}>{children}</Text>
        <CustomIcon
          style={styles.icon}
          size={17}
          color={
            (variant === TagVariant.DEFAULT && primaryColor) ||
            (variant === TagVariant.SECONDARY && secondaryColor) ||
            primaryColor
          }
          name={IconName.UI_TIMES_R.replace('tri-', '').replace('ui-', '')}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPress={(e: any) => onClickHandle(e)}
        />
      </View>
    )
  }

  if (!deletable && !display) {
    return (
      <View style={styles.tag} {...others}>
        <Text style={styles.text}>{children}</Text>
      </View>
    )
  }

  return <View />
}

export default Tag
