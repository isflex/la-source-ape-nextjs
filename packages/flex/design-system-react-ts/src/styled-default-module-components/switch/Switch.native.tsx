import React, { useState, useEffect } from 'react'
import { StyleSheet, Switch as SwitchNative, Platform } from 'react-native'
import { SwitchProps } from './SwitchProps'
import { nanoid } from 'nanoid'

/**
 * Switch Native Component
 * @param id {string} Is auto generate by default
 * @param label {string} Switch label
 * @param value {string} Switch value
 * @param checked {boolean} Checked switch
 * @param onChange {Function} onChange event
 * @param alert {AlertState} Alert Variant (INFO|SUCCESS|WARNING|DANGER)
 * @param disabled {boolean} Switch disabled
 * @param readonly {boolean} Switch readonly
 * @param name {string} Switch name
 * @param inverted {boolean} Invert switch color
 */
const Switch = ({
  id = nanoid(),
  checked,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  alert,
  disabled,
  readonly,
  name,
}: SwitchProps): React.JSX.Element => {
  const [_checked, setChecked] = useState<boolean>(checked || false)

  useEffect(() => {
    setChecked(checked || false)
  }, [checked])

  const defaultColor = '#109db9'
  const backgroundColor = '#DBDBDB'
  const thumbColor = '#fff'

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    switchIos: {
      transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
    },
    inverted: {},
  })

  return (
    <SwitchNative
      style={Platform.OS === 'ios' ? styles.switchIos : {}}
      trackColor={{ false: '#DBDBDB', true: alert?.getStyle() || defaultColor }}
      thumbColor={thumbColor}
      ios_backgroundColor={backgroundColor}
      onValueChange={(state) => {
        if (!readonly) {
          setChecked(!_checked)
        }
        if (onChange) {
          onChange({ switchState: state, switchName: name || '' })
        }
      }}
      nativeID={name ? `${name}_${id}` : id}
      disabled={disabled}
      value={_checked}
    />
  )
}

export default Switch
