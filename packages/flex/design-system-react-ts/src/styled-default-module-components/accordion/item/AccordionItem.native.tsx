import React, { useEffect, useRef, useState } from 'react'
import { View, TouchableWithoutFeedback, StyleSheet, Animated, Easing } from 'react-native'
import { AccordionItemProps } from './AccordionItemProps'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import icoMoonConfig from '../../../assets/fonts/icons/selection.json'
import { IconName } from '../../icon'

const CustomIcon = createIconSetFromFontello(icoMoonConfig)

/**
 * Accordion Item Component
 * @param active {boolean} Active Accordion Item
 * @param defaultActive {boolean} Default Item Activated
 * @param id {string} id for accordion item
 * @param onClick {ClickEvent} onClick Event
 * @param disabled {boolean} Disabled AccordionItem
 * @param headerItems {ReactNode} Header Items
 * @param bodyItems {ReactNode} Body Items
 */
const AccordionItem = ({
  active,
  id,
  onClick,
  disabled,
  headerItems,
  bodyItems,
  ...others
}: AccordionItemProps): React.JSX.Element => {
  const [isActive, setIsActive] = useState<boolean>(Boolean(typeof active !== 'undefined' ? active : false))
  const animatedController = useRef(new Animated.Value(0)).current
  const [bodySectionHeight, setBodySectionHeight] = useState<number>(0)

  const styles = StyleSheet.create({
    item: {
      width: '100%',
      maxWidth: '100%',
    },
    bodyBackground: {
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    titleContainer: {
      minWidth: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 5,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#EFEFEF',
    },
    bodyContainer: {
      padding: 10,
      paddingLeft: 10,
      position: 'absolute',
      bottom: 0,
    },
  })

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  })

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0rad', `${Math.PI}rad`],
  })

  const toggleListItem = () => {
    if (isActive) {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 0,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 1,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start()
    }
    setIsActive(!isActive)
  }

  useEffect(() => {
    setIsActive(active || false)
  }, [active])

  return (
    <>
      <TouchableWithoutFeedback
        style={styles.item}
        testID={id}
        onPress={() => !disabled && toggleListItem()}
        {...others}
      >
        <View style={styles.titleContainer}>
          {/* {Array.isArray(children) &&
            children.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (child: any, index: number) =>
                child &&
                child.type.name === 'AccordionHeader' &&
                React.cloneElement(child, {
                  key: index,
                }),
            )} */}
          {headerItems && <View>{headerItems}</View>}
          <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
            <CustomIcon
              name={IconName.UI_ARROW_DOWN_R.replace('tri-', '').replace('ui-', '')}
              size={15}
              color={isActive ? '#109db9' : '#333'}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.bodyBackground, { height: bodyHeight }]}>
        <View
          style={styles.bodyContainer}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onLayout={(e: any) => {
            setBodySectionHeight(e.nativeEvent.layout.height)
            if (onClick) {
              onClick(e)
            }
          }}
        >
          {/* {Array.isArray(children) &&
            children.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (child: any, index: number) =>
                child &&
                child.type.name === 'AccordionBody' &&
                React.cloneElement(child, {
                  key: index,
                }),
            )} */}
          {bodyItems && <View>{bodyItems}</View>}
        </View>
      </Animated.View>
    </>
  )
}

export default AccordionItem
