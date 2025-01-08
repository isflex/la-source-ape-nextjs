import React, { useState, useEffect } from 'react'
import { StyleSheet, Modal as NativeModal, TouchableOpacity } from 'react-native'
import { ModalProps } from './ModalProps'
import { Button, View, Text } from '../'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import icoMoonConfig from '../../assets/fonts/icons/selection.json'
import { IconName } from '../icon'
// import { useFonts } from 'expo-font'

const CustomIcon = createIconSetFromFontello(icoMoonConfig)
/**
 * Modal Component
 * @param active {boolean} Activated Modal
 * @param title {string} Title Modal
 * @param content {string} Content text for modal
 * @param triggerContent {string} Trigger custom element
 */
const Modal = ({
  active,
  title,
  content,
  triggerContent,
  ctaContent,
  ctaOnClick,
  ...others
}: ModalProps): Promise<React.JSX.Element> => {
  const [display, setDisplay] = useState<boolean>(active || false)

  // const [fontsLoaded] = useFonts({
  //   trilogyicons: require('../../assets/fonts/icons/trilogyicons.ttf'),
  // })

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 6,
      padding: 17,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      textAlign: 'center',
      fontSize: 21,
      fontWeight: '600',
    },
    content: {
      textAlign: 'center',
      fontSize: 15,
      paddingTop: 10,
    },
  })

  useEffect(() => {
    setDisplay(active || false)
  }, [active])

  return (
    <View {...others}>
      {triggerContent && <Button onClick={() => setDisplay(true)}>{triggerContent}</Button>}

      <NativeModal animationType='fade' transparent={true} visible={display}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* {fontsLoaded && ( */}
            <TouchableOpacity onPress={() => setDisplay(false)}>
              <CustomIcon
                style={{ flexDirection: 'row', alignSelf: 'flex-end' }}
                name={IconName.UI_TIMES_R.replace('tri-', '').replace('ui-', '')}
                size={20}
                color={'#b3b3b3'}
              />
            </TouchableOpacity>
            {/* )} */}
            {title && <Text style={styles.title}>{title}</Text>}
            {content && <Text style={styles.content}>{content}</Text>}
            {ctaContent && (
              <View style={{ paddingTop: 15 }}>
                <Button onClick={ctaOnClick}>{ctaContent}</Button>
              </View>
            )}
          </View>
        </View>
      </NativeModal>
    </View>
  )
}

export default Modal
