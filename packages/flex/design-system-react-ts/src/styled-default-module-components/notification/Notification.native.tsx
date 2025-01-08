import React from 'react'
import { StyleSheet } from 'react-native'
import { NotificationProps } from './NotificationProps'
import { View, Text, Columns, ColumnsItem, Button } from '../'
import { TextLevel } from '../text'
// import { useFonts } from 'expo-font'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import icoMoonConfig from '../../assets/fonts/icons/selection.json'
import { IconName } from '../icon'
import { VariantState } from '../../objects/facets/Variant'

const CustomIcon = createIconSetFromFontello(icoMoonConfig)
/**
 * Notification Component
 * @param iconName {IconName} Custom icon
 * @param title {string} Notification title content
 * @param description {string} Notification description content
 * @param alert {AlertState} Alert Variant (INFO|SUCCESS|WARNING|DANGER)
 * @param buttonClick {ClickEvent} Click event for button
 * @param buttonContent {string} Button content
 * @param arrow {boolean} Notification with right arrow on right side (Uses only if not button content)
 * @param info (boolean) Small info notification use it without button and arrow
 * @param banner {boolean} Banner notification
 */
const Notification = ({
  iconName,
  title,
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  alert,
  buttonContent,
  buttonClick,
  arrow,
  info,
  ...others
}: NotificationProps): React.JSX.Element => {
  // const [fontsLoaded] = useFonts({
  //   trilogyicons: require('../../assets/fonts/icons/trilogyicons.ttf'),
  // })

  const backgroundColor = '#fff'
  const defaultIconSize = 20
  const fontColor = alert?.getStyle() || '#25465f'

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingTop: 17,
      paddingBottom: 17,
      flex: 1,
      backgroundColor: backgroundColor,
      paddingLeft: 12,
      paddingRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notification: {
      paddingTop: (description && 5) || 0,
      paddingLeft: 12,
      paddingRight: 12,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 1,
    },
    title: {
      fontWeight: '600',
      alignItems: 'center',
      justifyContent: 'center',
      color: fontColor,
      textAlignVertical: 'center',
      paddingTop: (buttonContent && 12) || 0,
      paddingLeft: 5,
    },
    icon: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: (buttonContent && 10) || 0,
      position: (arrow && 'absolute') || 'relative',
      right: 0,
    },
    description: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
      color: fontColor,
      paddingBottom: 5,
      textAlignVertical: 'center',
    },
    buttonContainer: {
      width: '100%',
      paddingTop: 17,
      paddingBottom: 17,
      flex: 1,
      backgroundColor: backgroundColor,
      paddingLeft: 12,
      paddingRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
      textAlignVertical: 'center',
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    info: {
      width: '100%',
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: 'rgba(16,157,185,.1)',
      borderRadius: 6,
      alignItems: 'baseline',
      justifyContent: 'center',
      flex: 1,
      paddingLeft: 12,
      paddingRight: 12,
    },
  })

  if (info && title) {
    return (
      <View style={styles.info}>
        <Columns>
          <ColumnsItem size={1}>
            {/* {fontsLoaded && ( */}
            <CustomIcon
              style={styles.icon}
              name={IconName.UI_INFO_CIRCLE.replace('tri-', '').replace('ui-', '')}
              size={defaultIconSize}
              color={fontColor}
            />
            {/* )} */}
          </ColumnsItem>

          {title && (
            <ColumnsItem size={8}>
              <Text level={TextLevel.LEVEL3} style={styles.title}>
                {title}
              </Text>
            </ColumnsItem>
          )}
          <ColumnsItem size={3} />
        </Columns>
      </View>
    )
  }

  if (arrow && title) {
    return (
      <View style={[styles.buttonContainer, styles.shadow]} {...others}>
        <View style={[styles.notification, styles.shadow]}>
          <Columns>
            <ColumnsItem size={1}>
              {/* {fontsLoaded && ( */}
              <CustomIcon
                style={styles.icon}
                name={
                  iconName
                    ? iconName.replace('tri-', '').replace('ui-', '')
                    : IconName.UI_BELL.replace('tri-', '').replace('ui-', '')
                }
                size={defaultIconSize}
                color={fontColor}
              />
              {/* )} */}
            </ColumnsItem>

            {title && (
              <ColumnsItem size={5}>
                <Text level={TextLevel.LEVEL3} style={styles.title}>
                  {title}
                </Text>
              </ColumnsItem>
            )}
            {arrow && (
              <ColumnsItem size={5}>
                {/* {fontsLoaded && ( */}
                <CustomIcon
                  onPress={(e: unknown) => buttonClick && buttonClick(e)}
                  style={styles.icon}
                  name={IconName.UI_ARROW_RIGHT.replace('tri-', '').replace('ui-', '')}
                  size={defaultIconSize}
                  color={fontColor}
                />
                {/* )} */}
              </ColumnsItem>
            )}
          </Columns>
        </View>
      </View>
    )
  }

  if (buttonContent && title) {
    return (
      <View style={[styles.buttonContainer, styles.shadow]} {...others}>
        <View style={[styles.notification, styles.shadow]}>
          <Columns>
            <ColumnsItem size={1}>
              {/* {fontsLoaded && ( */}
              <CustomIcon
                style={styles.icon}
                name={
                  iconName
                    ? iconName.replace('tri-', '').replace('ui-', '')
                    : IconName.UI_BELL.replace('tri-', '').replace('ui-', '')
                }
                size={defaultIconSize}
                color={fontColor}
              />
              {/* )} */}
            </ColumnsItem>

            {title && (
              <ColumnsItem size={5}>
                <Text level={TextLevel.LEVEL3} style={styles.title}>
                  {title}
                </Text>
              </ColumnsItem>
            )}
            {buttonContent && (
              <ColumnsItem size={3}>
                <View style={styles.button}>
                  <Button onClick={buttonClick} variant={VariantState.PRIMARY}>
                    {buttonContent}
                  </Button>
                </View>
              </ColumnsItem>
            )}
          </Columns>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, styles.shadow]} {...others}>
      <View style={[styles.notification, styles.shadow]}>
        <Columns>
          <ColumnsItem size={1}>
            {/* {fontsLoaded && ( */}
            <CustomIcon
              style={styles.icon}
              name={
                iconName
                  ? iconName.replace('tri-', '').replace('ui-', '')
                  : IconName.UI_BELL.replace('tri-', '').replace('ui-', '')
              }
              size={defaultIconSize}
              color={fontColor}
            />
            {/* )} */}
          </ColumnsItem>

          {title && (
            <ColumnsItem size={9}>
              <Text level={TextLevel.LEVEL3} style={styles.title}>
                {title}
              </Text>
            </ColumnsItem>
          )}
        </Columns>
        {description && (
          <Columns>
            <ColumnsItem size={1} />
            <ColumnsItem size={9}>
              <Text level={TextLevel.LEVEL4} style={styles.description}>
                {description}
              </Text>
            </ColumnsItem>
          </Columns>
        )}
      </View>
    </View>
  )
}

export default Notification
