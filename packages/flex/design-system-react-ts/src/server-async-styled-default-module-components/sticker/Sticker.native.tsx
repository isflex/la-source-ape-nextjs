import React from 'react'
import { StyleSheet, Text, Platform } from 'react-native'
import { StickerProps } from './StickerProps'
import { View } from '../view'

/**
 * Sticker Native component
 * @param children {ReactNode} Sticker child
 * @param stretched {true|false} Stretched sticker
 * @param variant {AlertState} Sticker variant : primary|secondary
 * @param small {boolean} Small Sticker
 * @param alert {AlertState} Alert variant color for Sticker
 * @param hat {boolean} Hat Sticker
 * @param markup {StickerMarkup} Custom Markup for Sticker
 * @param inverted {boolean} Invert sticker color
 */
const Sticker = ({ children, variant, alert, small, stretched, ...others }: StickerProps): Promise<React.JSX.Element> => {
  const defaultColor = '#0055a4'
  const styles = StyleSheet.create({
    sticker: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 35,
      width: '100%',
      backgroundColor:
        (variant && !alert && variant.getStyle()) || (!variant && alert && alert.getStyle()) || defaultColor,
      borderTopRightRadius: (!small && 4) || 0,
      borderTopLeftRadius: (!small && 4) || 0,
    },
    stretched: {
      transform: Platform.OS === 'ios' ? (stretched && [{ skewX: '-20deg' }]) || [{ skewX: '0deg' }] : [],
      justifyContent: 'center',
      alignItems: 'center',
      height: 35,
      width: '100%',
      backgroundColor:
        (variant && !alert && variant.getStyle()) || (!variant && alert && alert.getStyle()) || defaultColor,
    },
    small: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 20,
      width: 80,
      backgroundColor: (variant && !alert && variant.getStyle()) || defaultColor,
      borderRadius: 3,
    },
    text: {
      textTransform: 'uppercase',
      textAlign: 'center',
      alignSelf: 'center',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: (!small && 15) || 10,
      transform: Platform.OS === 'ios' ? (stretched && [{ skewX: '20deg' }]) || [{ skewX: '0deg' }] : [],
    },
    stretchedAndroid: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 35,
      width: '100%',
      backgroundColor:
        (variant && !alert && variant.getStyle()) || (!variant && alert && alert.getStyle()) || defaultColor,
    },
    // triangleShape: {
    //   position: 'absolute',
    //   width: 0,
    //   height: 0,
    //   borderLeftWidth: 15,
    //   borderRightWidth: 10,
    //   borderTopWidth: 37,
    //   borderStyle: 'solid',
    //   backgroundColor: 'transparent',
    //   borderLeftColor: 'transparent',
    //   borderRightColor: 'transparent',
    //   borderTopColor: '#333',
    //   transform: [{ rotate: '20deg' }],
    // },
  })

  if (stretched && Platform.OS === 'android') {
    return (
      // <View style={{ flexDirection: 'row', flex: 1 }}>
      //   <View style={styles.triangleShape}></View>
      //   <View
      //     style={(small && styles.small) || (!small && stretched && styles.stretched) || styles.sticker}
      //     {...others}
      //   >
      //     {children && typeof children === 'string' ? <Text style={styles.text}>{children}</Text> : children}
      //   </View>
      //   <View style={styles.triangleShape}></View>
      // </View>
      <View
        style={(small && styles.small) || (!small && stretched && styles.stretchedAndroid) || styles.sticker}
        {...others}
      >
        {children && typeof children === 'string' ? <Text style={styles.text}>{children}</Text> : children}
      </View>
    )
  }

  return (
    <View style={(small && styles.small) || (!small && stretched && styles.stretched) || styles.sticker} {...others}>
      {children && typeof children === 'string' ? <Text style={styles.text}>{children}</Text> : children}
    </View>
  )
}

export default Sticker
