import React from 'react'
import { StyleSheet } from 'react-native'
import { InfoBlockHeaderProps } from './InfoBlockHeaderProps'
import { View, Title, TitleLevel } from '../../'
import { createIconSetFromFontello } from 'react-native-vector-icons'
// import { useFonts } from 'expo-font'
import icoMoonConfig from '../../../assets/fonts/icons/selection.json'
import { IconName } from '../../icon'
import { AlertState } from '../../../objects/facets/Alert'

const CustomIcon = createIconSetFromFontello(
  icoMoonConfig,
  'trilogyicons',
  '../../../assets/fonts/icons/trilogyicons.ttf',
)
/**
 * Info Block Header
 * @param children {string} Header title content
 * @param status {InfoBlockStatus} Icon status for header => SUCCESS|WARNING|DANGER
 * @param customIcon {IconName} Custom Icon for Info Block Header
 */
const InfoBlockHeader = ({ children, status, customIcon, ...others }: InfoBlockHeaderProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    infoBlock: {
      width: '100%',
      textAlign: 'center',
      paddingBottom: 6,
    },
    icon: {
      paddingBottom: 6,
      textAlign: 'center',
    },
    title: {
      textAlign: 'center',
    },
  })

  // const [fontsLoaded] = useFonts({
  //   trilogyicons: require('../../../assets/fonts/icons/trilogyicons.ttf'),
  // })

  return (
    <View style={styles.infoBlock} {...others}>
      {/* {fontsLoaded && ( */}
      <CustomIcon
        style={styles.icon}
        name={
          (customIcon && customIcon) ||
          (status === 'warning' && IconName.EXCLAMATION_CIRCLE.replace('tri-', '').replace('ui-', '')) ||
          IconName.CHECK_CIRCLE.replace('tri-', '').replace('ui-', '')
        }
        size={20}
        color={
          (status && status === 'success' && AlertState.SUCCESS.getStyle()) ||
          (status && status === 'warning' && AlertState.WARNING.getStyle()) ||
          AlertState.WARNING.getStyle()
        }
      />
      {/* )} */}
      <Title style={styles.title} level={TitleLevel.LEVEL6}>
        {children}
      </Title>
    </View>
  )
}

export default InfoBlockHeader
