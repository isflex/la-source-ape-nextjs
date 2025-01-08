import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { SelectProps } from './SelectProps'
import { View, Text, TextLevel } from '../'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import icoMoonConfig from '../../assets/fonts/icons/selection.json'
import { IconName } from '../icon'

const CustomIcon = createIconSetFromFontello(icoMoonConfig)
/**
 * Select Component
 * @param dynamicPlaceholder {boolean} Dynamic placeholder
 * @param id {string} Select id
 * @param name {string} Select name
 * @param label {string} Select label
 * @param selected {string} Selected value
 */
const Select = ({ children, name, id, selected, ...others }: SelectProps): React.JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<string>(selected || '')
  const [display, setDisplay] = useState<boolean>(false)

  useEffect(() => {
    setSelectedValue(selected || '')
  }, [selected])

  const borderColor = 'rgba(37,70,95,.4)'

  const styles = StyleSheet.create({
    select: {
      width: '100%',
      borderColor: borderColor,
      borderWidth: 1,
      height: 45,
      alignContent: 'center',
      justifyContent: 'center',
      paddingLeft: 10,
      borderRadius: 3,
    },
    icon: {
      position: 'absolute',
      right: 10,
    },
    text: {
      fontSize: 25,
      marginTop: 15,
    },
  })

  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity onPress={() => setDisplay(!display)} style={styles.select}>
        {children
          ? React.Children.map(
            children,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (child: any, index: number) =>
              child &&
              child.props.value === selectedValue && (
                <Text key={index} level={TextLevel.LEVEL3}>
                  {child.props.label}
                </Text>
              ),
          )
          : children}
        {display && (
          <Picker
            nativeID={`${`${id}_${name}`}`}
            selectedValue={selectedValue}
            style={{ height: 0, width: '100%', marginBottom: 75 }}
            onValueChange={(itemValue: string) => {
              setSelectedValue(itemValue)
              setDisplay(false)
            }}
            {...others}
          >
            {children}
          </Picker>
        )}
        <CustomIcon
          style={styles.icon}
          name={IconName.UI_ARROW_DOWN_R.replace('tri-', '').replace('ui-', '')}
          size={20}
          color={'#333'}
        />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.select}>
      <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue: string) => setSelectedValue(itemValue)}
      >
        {children}
      </Picker>
    </View>
  )
}

export default Select
