import React from 'react'
import { StyleSheet, Platform } from 'react-native'
import { IconProps } from './IconProps'
import { View } from '../view'
import { AlertState } from '../../objects/facets/Alert'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import icoMoonConfig from '../../assets/fonts/icons/selection.json'
import { IconName, IconSize, IconPosition, IconStatus, IconStatusPosition } from '../icon'
import { Text, TextLevel } from '../text'
import { IconColor } from './IconEnum'

const CustomIcon = createIconSetFromFontello(icoMoonConfig)

/**
 * Icon Component
 * @param name IconName
 * @param badgeContent {string} Display badge with icon
 * @param status SUCCESS|DANGER If CircleIcon or not
 * @param circled true-false if CircleIcon
 * @param content If TextIcon use it for text
 * @param position UP|DOWN|LEFT|RIGHT
 * @param stacked {boolean} Stacked icon
 * @param badgeContent {string} Icon with bage content
 * @param statusPosition {IconStatusPosition} Position for icon with status (TOP|BOTTOM)
 * @param stretched {boolean} Stretched icon
 */
const Icon = ({
  size,
  name,
  status,
  circled,
  content,
  position,
  stacked,
  badgeContent,
  statusPosition,
  stretched,
  color,
  ...others
}: IconProps): Promise<React.JSX.Element> => {
  const defaultSize =
    (size === IconSize.HUGE && 35) ||
    (size === IconSize.LARGE && 30) ||
    (size === IconSize.MEDIUM && 20) ||
    (size === IconSize.SMALL && 10) ||
    30

  const iconColor =
    (color === IconColor.SUCCESS && AlertState.SUCCESS.getStyle()) ||
    (color === IconColor.INFO && AlertState.INFO.getStyle()) ||
    (color === IconColor.TERTIARY && AlertState.TERTIARY.getStyle()) ||
    (color === IconColor.WARNING && AlertState.WARNING.getStyle()) ||
    (color === IconColor.DANGER && AlertState.DANGER.getStyle()) ||
    (color === IconColor.WHITE && '#fff') ||
    (status && status === 'success' && AlertState.SUCCESS.getStyle()) ||
    (status && status === 'warning' && AlertState.WARNING.getStyle()) ||
    '#25465f'

  const circledWidth =
    (size === IconSize.HUGE && 60) ||
    (size === IconSize.LARGE && 50) ||
    (size === IconSize.MEDIUM && 40) ||
    (size === IconSize.SMALL && 20) ||
    30

  const styles = StyleSheet.create({
    container: {
      minWidth: 10,
      alignSelf: 'baseline',
    },
    circled: {
      width: circledWidth,
      height: circledWidth,
      backgroundColor: iconColor,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconCircled: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconText: {
      marginRight: (position === IconPosition.LEFT && 10) || 0,
      marginLeft: (position === IconPosition.RIGHT && 10) || 0,
      marginBottom: (position === IconPosition.UP && 10) || 0,
      marginTop: (position === IconPosition.DOWN && 10) || 0,
    },
    icon: {
      transform: Platform.OS === 'ios' ? (stretched && [{ skewX: '20deg' }]) || [{ skewX: '0deg' }] : [],
    },
    smallStatusIconTop: {
      position: 'absolute',
      right: 0,
      top: -3,
    },
    smallStatusIconBottom: {
      position: 'absolute',
      right: 0,
      bottom: -3,
    },
    contentContainer: {
      minWidth: 50,
      alignSelf: 'baseline',
      alignItems: 'center',
      flexDirection:
        (position === IconPosition.DOWN && 'column') || (position === IconPosition.UP && 'column-reverse') || 'row',
    },
    stetched: {
      justifyContent: 'center',
      alignItems: 'center',
      width: circledWidth + 15,
      height: circledWidth,
      backgroundColor: iconColor,
      borderTopRightRadius: 10,
      transform: Platform.OS === 'ios' ? (stretched && [{ skewX: '-20deg' }]) || [{ skewX: '0deg' }] : [],
    },
    text: {
      textAlign: 'center',
      color:
        (color === IconColor.SUCCESS && AlertState.SUCCESS.getStyle()) ||
        (color === IconColor.INFO && AlertState.INFO.getStyle()) ||
        (color === IconColor.TERTIARY && AlertState.TERTIARY.getStyle()) ||
        (color === IconColor.WARNING && AlertState.WARNING.getStyle()) ||
        (color === IconColor.DANGER && AlertState.DANGER.getStyle()) ||
        (color === IconColor.WHITE && '#fff') ||
        '#25465f',
    },
  })

  const statusIcon = status === IconStatus.SUCCESS ? IconName.CHECK_CIRCLE : IconName.TIMES_CIRCLE

  if (stretched && !circled) {
    return (
      <View style={styles.stetched}>
        <CustomIcon
          style={[styles.iconCircled, styles.icon]}
          name={name.replace('tri-', '').replace('ui-', '')}
          size={defaultSize}
          color={'#fff'}
        />
      </View>
    )
  }

  // status icons
  if (status && !circled && !stretched) {
    return (
      <View style={styles.container}>
        <CustomIcon
          style={styles.icon}
          name={name.replace('tri-', '').replace('ui-', '')}
          size={defaultSize}
          color={iconColor}
        />
        <CustomIcon
          style={statusPosition === IconStatusPosition.TOP ? styles.smallStatusIconTop : styles.smallStatusIconBottom}
          name={statusIcon.replace('tri-', '').replace('ui-', '')}
          size={10}
          color={iconColor}
        />
      </View>
    )
  }

  if (circled) {
    return (
      <View style={styles.circled} {...others}>
        <CustomIcon
          style={styles.iconCircled}
          name={name.replace('tri-', '').replace('ui-', '')}
          size={defaultSize}
          color={'#fff'}
        />
      </View>
    )
  }

  // Text icon
  if (content && !badgeContent) {
    return (
      <View style={styles.contentContainer}>
        {!position && <Text style={styles.text}>{content}</Text>}

        {(position === IconPosition.RIGHT || position === IconPosition.DOWN) && content && (
          <Text style={styles.text} level={TextLevel.LEVEL3}>
            {content}
          </Text>
        )}

        {(position === IconPosition.UP || stacked) && content && (
          <Text style={styles.text} level={TextLevel.LEVEL3}>
            {content}
          </Text>
        )}

        <CustomIcon
          style={styles.iconText}
          name={name.replace('tri-', '').replace('ui-', '')}
          size={defaultSize}
          color={iconColor}
        />

        {position === IconPosition.LEFT && content && (
          <Text style={styles.text} level={TextLevel.LEVEL3}>
            {content}
          </Text>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container} {...others}>
      <CustomIcon
        style={styles.icon}
        name={name.replace('tri-', '').replace('ui-', '')}
        size={defaultSize}
        color={iconColor}
      />
    </View>
  )
}

export default Icon
