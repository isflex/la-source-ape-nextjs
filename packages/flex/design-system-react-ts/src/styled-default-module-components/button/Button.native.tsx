import React, { useEffect } from 'react'
import { TouchableOpacity, StyleSheet, Text, Animated } from 'react-native'
// import { TouchableOpacity, StyleSheet, Text, Animated, Image } from 'react-native'
import { ButtonProps } from './ButtonProps'

/**
 * Button Native Component
 * @param loading {boolean} Loading button
 * @param inverted {boolean} Inverted button
 * @param disabled {boolean} Disabled button
 * @param variant {Color} Button color : primary|secondary
 * @param alert {AlertState} Alert variant color for Button
 * @param children {ReactNode} Button child
 * @param small {boolean} Small button
 * @param fullwidth {boolean} Fullwidth button
 * @param compact {boolean} Compacted button size
 */
const Button = ({
  children,
  variant,
  alert,
  onClick,
  disabled,
  small,
  loading,
  fullwidth,
  compact,
  ...others
}: ButtonProps): React.JSX.Element => {
  const iconAnimation = new Animated.Value(0)

  const animateIcon = () => {
    Animated.sequence([
      Animated.delay(0),
      Animated.timing(iconAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(iconAnimation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      // Call on self when animation completes
    ]).start(animateIcon)
  }

  useEffect(() => {
    animateIcon()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const styles = StyleSheet.create({
    button: {
      minWidth: !compact ? '100%' : 120,
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 15,
      paddingBottom: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        (loading && loading.getClassName() === 'loading' && '#7F7F7F') ||
        (variant && !alert && !disabled && variant.getStyle()) ||
        (alert && !variant && !disabled && alert.getStyle()) ||
        '#fe544b',
      borderRadius: 4,
      minHeight: (small && 30) || 45,
    },
    buttonSecondary: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderColor: variant && variant.getStyle(),
      borderWidth: 2,
    },
    disabled: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E2E2E2',
      borderRadius: 4,
      height: (small && 30) || 45,
      borderColor: '#B7B7B7',
      borderWidth: 2,
    },
    text: {
      color: variant && variant.getClassName() === 'secondary' ? variant.getStyle() : '#fff',
      alignSelf: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      justifyContent: 'center',
    },
    textDisabled: {
      color: '#B7B7B7',
      alignSelf: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      justifyContent: 'center',
    },
    fullwidth: {
      alignSelf: 'stretch',
    },
  })

  const rotationalAnimation = iconAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        !disabled && styles.button,
        !disabled && variant && variant.getClassName() === 'secondary' && styles.buttonSecondary,
        disabled && styles.disabled,
        fullwidth && styles.fullwidth,
      ]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPress={(e: any) => onClick && onClick(e)}
      {...others}
    >
      {loading && loading.getClassName() === 'loading' && (
        <Animated.View
          style={{
            alignSelf: 'center',
            width: 27,
            height: 27,
            transform: [{ rotate: rotationalAnimation }],
          }}
        >
          {/* <Image style={{ width: 27, height: 27 }} source={require('../../assets/images/spin-loading.png')} /> */}
        </Animated.View>
      )}
      {loading?.getClassName() === 'loaded' && (
        <Text style={(!disabled && styles.text) || (disabled && styles.textDisabled)}>{children}</Text>
      )}
      {!loading && children && typeof children === 'string' && (
        <Text style={(!disabled && styles.text) || (disabled && styles.textDisabled)}>{children}</Text>
      )}
    </TouchableOpacity>
  )
}

export default Button
